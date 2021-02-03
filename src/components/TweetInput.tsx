import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth, db, storage } from "../config/firebase";
import { Avatar, Button, IconButton } from "@material-ui/core";
import firebase from "firebase/app";
//dbにタイムスタンプを格納するfirebase.firestore.FieldValue.serverTimestamp()メソッドを使用するためにfirebaseのimportが必要
import AddPhotoIcon from "@material-ui/icons/AddAPhoto";

const TweetInput: React.FC = () => {
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
        .join(""); //.join("")メソッドでarrayの要素（文字）を結合し、文字列としてrandomCharに格納
      const fileName = randomChar + "_" + tweetImage.name;//fileNameにランダム文字列と画像名を結合した文字列を格納
      const uploadTweetImage = storage
        .ref(`images2/${fileName}`)
        .put(tweetImage); //ランダムで生成したfile名のリファレンスにtweetImageを格納する

      uploadTweetImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, //プログレスに関しては特に実行しないため空の関数を格納
        (err) => {
          alert(err.message);
        }, //エラー発生時はアラートで表示
        async () => {
          await storage
            .ref("images2")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts2").add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMessage,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              });
            });
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
    setTweetMessage("");
    setTweetImage(null);
    console.log("submit");
  };

  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }} //サインアウトの実行をアバターのクリックで実行
          />
          <input
            className={styles.tweet_input}
            type="text"
            placeholder="つぶやいてみよう"
            autoFocus
            value={tweetMessage}
            onChange={(e) => {
              setTweetMessage(e.target.value);
            }}
          />
          <IconButton>
            <label>
              <AddPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMessage}
          className={
            tweetMessage ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          つぶやく
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
