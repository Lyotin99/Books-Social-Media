import { admin, db } from "../util/admin";
import firebase from "firebase";
import { config } from "../util/config";
firebase.initializeApp(config);
import {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} from "../util/validators";
import { Response } from "express";

interface NewUser {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}
interface UserData {
  username: string;
  email: string;
  createdAt: Date;
  userId: string;
  imageUrl: string;
}
interface LoginUser {
  email: string;
  password: string;
}
const signup = (req: any, res: any) => {
  const registeredUser: NewUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };
  const { valid, errors } = validateSignupData(registeredUser);
  if (!valid) return res.status(400).json(errors);
  const noImg: string = "no-img.png";
  let token: string, userId: string;
  db.doc(`/users/${registeredUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ username: "This username is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(
            registeredUser.email,
            registeredUser.password
          )
          .then((data) => {
            if (data.user?.uid) {
              userId = data.user?.uid;
            }
            return data.user?.getIdToken();
          })
          .then((idToken) => {
            if (idToken) token = idToken;

            const userCredentials: UserData = {
              email: registeredUser.email,
              username: registeredUser.username,
              createdAt: new Date(),
              userId,
              imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            };
            db.doc(`/users/${registeredUser.username}`)
              .set(userCredentials)
              .then(() => {
                return res.status(201).json({ token: token });
              });
          })
          .catch((err) => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
              return res.status(400).json({ email: "Email is already in use" });
            } else {
              return res
                .status(500)
                .json({ general: "Something went wrong, please try again" });
            }
          });
      }
    });
};

const login = (req: any, res: any) => {
  const user: LoginUser = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user?.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);

      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials. Please try again" });
      } else if (err.code === "auth/user-not-found") {
        return res
          .status(403)
          .json({ general: "Wrong credentials. Please try again" });
      } else return res.status(500).json({ error: err.code });
    });
};
const uploadImage = (req: any, res: any) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName: string;
  interface ImageToBeUploaded {
    filepath: string;
    mimetype: string;
  }
  let imageToBeUploaded: ImageToBeUploaded;
  busboy.on(
    "file",
    (
      fieldname: string,
      file: Response,
      filename: string,
      encoding: string,
      mimetype: string
    ) => {
      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(400).json({ error: "Wrong file type submitted" });
      }
      const imageExtension: string = filename.split(".")[
        filename.split(".").length - 1
      ];
      imageFileName = `${Math.round(
        Math.random() * 100000000000
      )}.${imageExtension}`;

      const filepath: string = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    }
  );
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl: string = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.username}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully!" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

const addUserDetails = (req: any, res: any) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.username}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
interface PostsData {
  body: string;
  createdAt: Date;
  username: string;
  userImage: string;
  likeCount: number;
  commentCount: number;
  postId: string;
}
interface NotificationsData {
  recipient: string;
  sender: string;
  createdAt: Date;
  postId: string;
  type: string;
  read: boolean;
  notificationId: string;
}
interface LikesData {
  username: string;
  postId: string;
}
interface AuthenticatedUserData {
  credentials?: {
    userId?: string;
    email?: string;
    username?: string;
    createdAt?: Date;
    imageUrl?: string;
    bio?: string;
    website?: string;
    favoriteQuote?: string;
    favoriteBook?: string;
    location?: string;
  };
  likes?: LikesData[];
  notifications?: NotificationsData[];
  savedPosts?: LikesData[];
  posts?: PostsData[];
}
const getAuthenticatedUser = (req: any, res: any) => {
  let userData: AuthenticatedUserData = {};

  db.doc(`/users/${req.user.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("username", "==", req.user.username)
          .get();
      } else return res.status(500);
    })
    .then((data) => {
      userData.likes = [];
      if (data) {
        data.forEach((doc: any) => {
          if (userData.likes) userData.likes.push(doc.data());
        });
      }
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.username)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        if (userData.notifications)
          userData.notifications.push({
            recipient: doc.data().recipient,
            sender: doc.data().sender,
            createdAt: doc.data().createdAt,
            postId: doc.data().postId,
            type: doc.data().type,
            read: doc.data().read,
            notificationId: doc.id,
          });
      });
      return db
        .collection("savedPosts")
        .where("username", "==", req.user.username)
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.savedPosts = [];
      data.forEach((doc) => {
        if (userData.savedPosts) {
          userData.savedPosts.push({
            username: doc.data().username,
            postId: doc.data().postId,
          });
        }
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const getUserDetails = (req: any, res: any) => {
  let userData: AuthenticatedUserData = {};
  db.doc(`/users/${req.params.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("posts")
          .where("username", "==", req.params.username)
          .orderBy("createdAt", "desc")
          .get();
      } else return res.status(404).json({ error: "User not found" });
    })
    .then((data) => {
      userData.posts = [];
      data?.forEach((doc: any) => {
        if (userData.posts)
          userData.posts.push({
            body: doc.data().body,
            createdAt: doc.data().createdAt,
            username: doc.data().username,
            userImage: doc.data().userImage,
            likeCount: doc.data().likeCount,
            commentCount: doc.data().commentCount,
            postId: doc.id,
          });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
const markNotificationsRead = (req: any, res: any) => {
  let batch = db.batch();
  req.body.forEach((notificationId: string) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
export {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
};
