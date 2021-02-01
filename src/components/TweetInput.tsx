import React from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "../config/firebase";
import { Avatar } from "@material-ui/core";
const TweetInput = () => {
  const user = useSelector(selectUser);
  return (
    <div>
      <Avatar
        className={styles.tweet_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await auth.signOut();
        }} //サインアウトの実行をアバターのクリックで実行
      />
    </div>
  );
};

export default TweetInput;
