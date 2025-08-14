// TODO:
/* 
- many fast clicks will vote multiple times for a team
- Add voting based on location
*/

import React, { useContext, useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { AuthContext } from "./AuthProvider";


async function fetchResetTimestamp() {
  const resetDocRef = doc(db, "metadata", "reset");
  const resetDocSnap = await getDoc(resetDocRef);

  if (resetDocSnap.exists()) {
    const data = resetDocSnap.data();
    const resetAt = data.resetAt;

    if (resetAt && resetAt.toMillis) {
      return resetAt.toMillis();
    }
  }

  console.error("No resetAt timestamp found.");
  return 0;
}

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [votedTeamId, setVotedTeamId] = useState(null);
  const user = useContext(AuthContext);

  // Fetch teams on mount
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

  // Fetch vote from Firestore
  useEffect(() => {
    async function fetchVotedTeam() {
      if (!user) return;

      const voteDocRef = doc(db, "votes", user.uid);
      const voteDocSnap = await getDoc(voteDocRef);
      const resetTimestamp = await fetchResetTimestamp();

      if (voteDocSnap.exists()) {
        const data = voteDocSnap.data();
        const voteTime = data.timestamp?.toMillis?.() || 0;

        if (voteTime > resetTimestamp) {
          setVotedTeamId(data.teamId);
        } else {
          setVotedTeamId(null);
          await deleteDoc(voteDocRef);
        }
      } else {
        setVotedTeamId(null);
      }
    }

    fetchVotedTeam();
  }, [user]);

  const handleVote = async (teamId) => {
    if (!user) {
      console.error("User not logged in");
      alert("user isn't logged in")
      return;
    }

    alert("User is voting: " + user.uid);

    const voteDocRef = doc(db, "votes", user.uid);
    const currentVoteSnap = await getDoc(voteDocRef);
    const resetTimestamp = await fetchResetTimestamp();
    const now = Date.now();

    if (currentVoteSnap.exists()) {
      const currentVote = currentVoteSnap.data();
      const voteTime = currentVote.timestamp?.toMillis?.() || 0;

      if (voteTime > resetTimestamp && currentVote.teamId === teamId) {
        alert("You've already voted for this team.");
        return;
      }

      // Decrement previous team vote
      const oldTeamRef = doc(db, "teams", currentVote.teamId);
      await updateDoc(oldTeamRef, {
        votes: increment(-1),
        voters: arrayRemove(user.uid),
      });
    }

    // Increment new team vote
    const newTeamRef = doc(db, "teams", teamId);
    await updateDoc(newTeamRef, {
      votes: increment(1),
      voters: arrayUnion(user.uid),
    });

    // Write vote doc
    await updateDoc(voteDocRef, {
      teamId,
      timestamp: new Date(),
    }).catch(async () => {
      await setDoc(voteDocRef, {
        teamId,
        timestamp: new Date(),
      });
    });

    setVotedTeamId(teamId);
  };

  return (
    <div>
      <h2>Vote for a Team!</h2>
      <ul>
        {teams.map((team) => (
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
