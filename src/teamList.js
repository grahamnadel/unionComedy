import React, { useContext, useEffect, useState } from "react";
import { db, collection, getDocs, doc, updateDoc, increment } from "./firebase";
import { getDoc } from "firebase/firestore";
import { AuthContext } from "./AuthProvider";
import { arrayUnion, arrayRemove } from "firebase/firestore";  // Add this import


const getVotedTeam = () => localStorage.getItem("votedTeam");
const setVotedTeam = (teamId) => localStorage.setItem("votedTeam", teamId);
const setVoteTimestamp = (timestamp) => localStorage.setItem("voteTimestamp", timestamp.toString());
const getVoteTimestamp = () => parseInt(localStorage.getItem("voteTimestamp"), 10) || 0;



async function fetchResetTimestamp() {
  const resetDocRef = doc(db, "metadata", "reset");
  const resetDocSnap = await getDoc(resetDocRef);

  if (resetDocSnap.exists()) {
    const data = resetDocSnap.data();
    const resetAt = data.resetAt;

    if (resetAt && resetAt.toMillis) {
      // Firestore Timestamp → milliseconds since epoch
      return resetAt.toMillis();
    }
  }

  console.error("No resetAt timestamp found.");
  return 0;
}


function TeamList() {
  const [teams, setTeams] = useState([]);
  const [votedTeamId, setVotedTeamId] = useState(getVotedTeam())
  const user = useContext(AuthContext);

  useEffect(() => {
    async function checkReset() {
      const resetTimestamp = await fetchResetTimestamp();
      const voteTimestamp = getVoteTimestamp();
  
      if (resetTimestamp > voteTimestamp) {
        // Reset happened after user voted, clear vote info
        setVotedTeam(null); // Clears localStorage
        localStorage.removeItem("votedTeam");
        localStorage.removeItem("voteTimestamp");
        setVotedTeamId(null); // <-- Also clear React state
      }
    }
  
    checkReset();
  }, []);
  
  
  useEffect(() => {
    async function fetchTeams() {
      const teamsCol = collection(db, "teams");
      const teamSnapshot = await getDocs(teamsCol);
      const teamList = teamSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamList);
    }

    fetchTeams();
  }, []);

  // Voting function: increments vote count in Firestore
  // inside handleVote
  const handleVote = async (teamId) => {
    const previousVote = getVotedTeam();
    const now = Date.now();
    setVoteTimestamp(now);
  
    // If user votes for the same team again, do nothing
    if (previousVote === teamId) {
      alert("You've already voted for this team.");
      return;
    }
  
    try {
      if (previousVote) {
        const oldTeamRef = doc(db, "teams", previousVote);
        
        // Fetch latest voters array from Firestore
        const oldTeamSnap = await getDoc(oldTeamRef);
        const oldTeamData = oldTeamSnap.data();
  
        if (oldTeamData?.voters?.includes(user.uid)) {
          // Only decrement if user's uid is still present in voters array
          await updateDoc(oldTeamRef, {
            votes: increment(-1),
            voters: arrayRemove(user.uid),
          });
        }
        // else: user not found in voters list, no decrement needed
      }
  
      // Increment new vote and add user uid to voters
      const newTeamRef = doc(db, "teams", teamId);
      await updateDoc(newTeamRef, {
        votes: increment(1),
        voters: arrayUnion(user.uid),
      });
  
      // Save new vote locally
      setVotedTeam(teamId);
      setVotedTeamId(teamId);
  
    } catch (error) {
      console.error("Error updating votes: ", error);
    }
  };
  


  return (
    <div>
      <h2>Vote for a Team!</h2>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            <button 
            onClick={() => handleVote(team.id)}
            className={team.id === votedTeamId ? "voted-button" : ""}
            >
              {team.name}
              </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamList;
