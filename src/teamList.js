import React, { useEffect, useState } from "react";
import { db, collection, getDocs, doc, updateDoc, increment } from "./firebase";

const getVotedTeam = () => localStorage.getItem("votedTeam");
const setVotedTeam = (teamId) => localStorage.setItem("votedTeam", teamId);

function TeamList() {
  const [teams, setTeams] = useState([]);

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

  // 🔘 Voting function: increments vote count in Firestore
  const handleVote = async (teamId) => {
    const previousVote = getVotedTeam();
  
    if (previousVote === teamId) {
      alert("You've already voted for this team.");
      return;
    }
  
    // Decrement old vote if exists
    if (previousVote) {
      const oldTeamRef = doc(db, "teams", previousVote);
      await updateDoc(oldTeamRef, {
        votes: increment(-1),
      });
    }
  
    // Increment new vote
    const newTeamRef = doc(db, "teams", teamId);
    await updateDoc(newTeamRef, {
      votes: increment(1),
    });
  
    // Save new vote locally
    setVotedTeam(teamId);
    alert(`You voted for ${teamId}!`);
  };   

  return (
    <div>
      <h2>Vote for a Team!</h2>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            <button onClick={() => handleVote(team.id)}>{team.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamList;
