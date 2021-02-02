import React from "react";
import styles from "./Feed.module.css";
import { auth } from "../config/firebase";
import TweetInput from "./TweetInput";


const Feed: React.FC = () => {
  return (
    <>
      Feed
      <TweetInput />
      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Logout
      </button>
    </>
  );
};

export default Feed;
