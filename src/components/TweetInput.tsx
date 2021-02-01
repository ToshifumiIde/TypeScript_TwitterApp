import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth, db, storage } from "../config/firebase";
import { Avatar } from "@material-ui/core";
import firebase from "firebase/app";
//dbにタイムスタンプを格納する.serverTimestamp()メソッドを使用するためにfirebaseのimportが必要
const TweetInput = () => {
  const user = useSelector(selectUser);
  //react-reduxの機能を用いてuser情報を取得
  const [tweetMessage, setTweetMessage] = useState<string>("");
  const [tweetImage, setTweetImage] = useState<File | null>(null);

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");//.join("")メソッドで文字を結合する
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImage = storage
        .ref(`images/${fileName}`)
        .put(tweetImage);//ランダムで生成したfile名のリファレンスにtweetImageを格納する
      uploadTweetImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, //プログレスに関しては特に実行しないため空の関数を格納
        (err) => {
          alert(err.message);
        }, //エラー発生時はアラートで表示
        async () =>{
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url)=>{
              await db.collection("posts2").add({
                avatar:user.photoUrl,
                image:tweetImage,
                text:tweetMessage,
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                username:user.displayName,
              })
            })
        }
      );
    } else {
      db.collection("posts2").add({
        avatar: user.photoUrl,
        image: "",
        text: tweetMessage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      }); //dbの中に新たに"posts2"collectionを作成し、add()メソッドでtweet情報のオブジェクトを渡す
    }
  };

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
