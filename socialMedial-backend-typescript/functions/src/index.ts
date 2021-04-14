import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import { admin, db } from "./util/admin";
const app: express.Application = express();
app.use(cors());
import {
  getAllPosts,
  postOnePost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost,
  editPost,
  deleteComment,
  editComment,
  savePost,
  unsavePost,
  getAllSavedPosts,
  uploadImagePost,
  replyComment,
  getCommentReplies,
} from "./handlers/posts";
import {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  markNotificationsRead,
  getUserDetails,
} from "./handlers/users";
import { FBAuth } from "./util/fbAuth";

//Posts
app.get("/posts", getAllPosts);
app.post("/posts", FBAuth, postOnePost);
app.get("/post/:postId", getPost);
app.post("/post/:postId/comment", FBAuth, commentOnPost);
app.get("/post/:postId/like", FBAuth, likePost);
app.get("/post/:postId/unlike", FBAuth, unlikePost);
app.delete("/post/:postId", FBAuth, deletePost);
app.delete("/post/:postId/comment/:commentId", FBAuth, deleteComment);
app.put("/post/:postId", FBAuth, editPost);
app.put("/comment/:commentId", FBAuth, editComment);
app.post("/post", FBAuth, uploadImagePost);
//Comment replies
app.get("/comments/:commentId", getCommentReplies);
app.post("/comments/:commentId/replies", FBAuth, replyComment);

//Save Posts
app.get("/saved/:postId", FBAuth, savePost);
app.get("/unsaved/:postId", FBAuth, unsavePost);
app.get("/saved", FBAuth, getAllSavedPosts);

//User Routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

app.get("/user/:username", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);
const api = functions.region("europe-west1").https.onRequest(app);

const createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("/likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data()!.username !== snapshot.data().username) {
          return db
            .doc(`/notifications/${snapshot.id}`)
            .set({
              createdAt: admin.firestore.Timestamp.fromDate(
                new Date()
              ).toDate(),
              recipient: doc.data()!.username,
              sender: snapshot.data().username,
              type: "like",
              read: false,
              postId: doc.id,
            })
            .then(() => {
              return;
            })
            .catch((err) => {
              console.error(err);
              return;
            });
        } else return;
      });
  });

const createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document(`/comments/{id}`)
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data()!.username !== snapshot.data().username) {
          return db
            .doc(`/notifications/${snapshot.id}`)
            .set({
              createdAt: admin.firestore.Timestamp.fromDate(
                new Date()
              ).toDate(),
              recipient: doc.data()!.username,
              sender: snapshot.data().username,
              type: "comment",
              read: false,
              postId: doc.id,
            })

            .catch((err) => {
              console.error(err);
            });
        } else return;
      });
  });

const deleteNotificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document(`/likes/{id}`)
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()

      .catch((err) => {
        console.error(err);
        return;
      });
  });

const onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      return db
        .collection("posts")
        .where("username", "==", change.before.data().username)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

const onPostDeleted = functions
  .region("europe-west1")
  .firestore.document("/posts/{postId}")
  .onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("postId", "==", postId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("postId", "==", postId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("postId", "==", postId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
export {
  api,
  createNotificationOnLike,
  createNotificationOnComment,
  deleteNotificationOnUnlike,
  onUserImageChange,
  onPostDeleted,
};
