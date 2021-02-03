import React from "react";
import styles from "./Feed.module.css";
import { auth } from "../config/firebase";
import TweetInput from "./TweetInput";

const Feed: React.FC = () => {
  return (
    <div className={styles.feed}>
      Feed
      <TweetInput />
      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Feed;
