import React, { useState, useEffect } from "react";
import styles from "./Feed.module.css";
import { auth, db } from "../config/firebase";
import TweetInput from "./TweetInput";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: "",
      avatar: "",
      image: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("posts2")
      .orderBy("timestamp", "desc") //並べ替えをtimestampのdocs(降順)で実施することで、最新のものが先頭に来る
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar, //fieldの属性に関しては、doc.data()メソッドを使用することでアクセス可能
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        );
      });
    return () => {
      unSub(); //アンマウントされた時のcleanup関数で、unSub()を実行する
    };
  }, []);

  return (
    <div className={styles.feed}>
      Feed
      <TweetInput />
      {posts.map((post) => (
        <h3>{post.id}</h3>
      ))}
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
