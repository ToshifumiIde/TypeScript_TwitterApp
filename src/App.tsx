import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./config/firebase";
import Auth from "./components/Auth";
import Feed from "./components/Feed";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      // userが存在すればdispatch内のloginが呼ばれて、userSliceで設定したinitStateに何かしらのuser情報が格納される
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);
  return (
    <>
      {user.uid ? (
          <Auth />
      ) : (
        <div className={styles.app}>
          <Feed />
        </div>
      )}
    </>
  );
};

export default App;
