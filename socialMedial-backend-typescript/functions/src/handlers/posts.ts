import { db, admin } from "../util/admin";
import { config } from "../util/config";
interface Post {
  username: string;
  body: string;
  createdAt: Date | number;
  postId?: string;
  userImage?: string;
  likeCount?: number;
  imageUrl?: string;
  commentCount?: number;
}
const getAllPosts = (req: any, res: any) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let posts: Post[] = [];
      data.forEach((doc) => {
        posts.push({
          username: doc.data().username,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          postId: doc.id,
          imageUrl: doc.data().imageUrl,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
        });
      });
      return res.json(posts);
    })
    .catch((err) => {
      console.error(err);
    });
};

// const getAllPosts = (req: any, res: any) => {
//   const unsubscribe = db
//     .collection("posts")
//     .orderBy("createdAt", "desc")
//     .onSnapshot((querySnapshot) => {
//       let arr: any = [];
//       querySnapshot.forEach((doc) => arr.push({ ...doc.data(), id: doc.id }));

//       return res.status(200).json(arr);
//     });
//   return unsubscribe;
// };

const postOnePost = (req: any, res: any) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }
  const newPost: Post = {
    username: req.user.username,
    body: req.body.body,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()).toDate(),
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      const resPost: Post = newPost;
      resPost.postId = doc.id;

      return res.json({
        username: req.user.username,
        body: req.body.body,
        createdAt: Math.floor(new Date().getTime() / 1000),
        userImage: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0,
        postId: doc.id,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

const editPost = (req: any, res: any) => {
  let body: string = req.body.body;

  if (body.trim() === "") {
    return res.status(400).json({ error: "Can't be empty post." });
  }
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (req.user.username !== doc.data()!.username) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      doc.ref
        .update({ body })
        .then(() => {
          return res.json(body);
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    });
};

const editComment = (req: any, res: any) => {
  let comment: string = req.body.body;
  if (comment.trim() === "") {
    return res.status(400).json({ error: "Can't be empty comment." });
  }
  db.doc(`/comments/${req.params.commentId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Comment not found." });
      }
      if (req.user.username !== doc.data()!.username) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      doc.ref
        .update({ body: comment })
        .then(() => {
          return res.json({ body: comment, commentId: req.params.commentId });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    });
};

const getCommentReplies = (req: any, res: any) => {
  interface ReplyData {
    body: string;
    createdAt: Date;
    username: string;
    commentId: string;
    userImage: string;
    replyId: string;
  }
  db.collection("replies")
    .where("commentId", "==", req.params.commentId)
    .orderBy("createdAt", "asc")
    .get()
    .then((doc) => {
      const commentReplies: ReplyData[] = [];
      doc.forEach((data) => {
        commentReplies.push({
          body: data.data().body,
          commentId: data.data().commentId,
          createdAt: data.data().createdAt,
          userImage: data.data().userImage,
          username: data.data().username,
          replyId: data.id,
        });
      });
      return res.json(commentReplies);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
const getPost = (req: any, res: any) => {
  interface CommentsOnPost {
    createdAt?: Date;
    postId?: string;
    body?: string;
    userImage?: string;
    username?: string;
    data?: any;
    id: string;
    replies: NewReply;
  }
  interface PostWithComments {
    body?: string;
    createdAt?: Date;
    username?: string;
    userImage?: string;
    postId?: string;
    comments?: CommentsOnPost[];
  }
  let postData: PostWithComments = {};
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      postData = doc.data()!;
      postData.postId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("postId", "==", req.params.postId)
        .get();
    })
    .then((data) => {
      postData.comments = [];
      data.forEach((doc: CommentsOnPost) => {
        if (postData.comments)
          postData.comments.push({ ...doc.data(), commentId: doc.id });
      });

      return res.json(postData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

interface NewComment {
  body: string;
  createdAt: Date;
  postId: string;
  username: string;
  userImage?: string;
  repliesCount: number;
  replies?: NewReply;
}

interface NewReply {
  body: string;
  createdAt: Date;
  commentId: string;
  username: string;
  userImage: string;
}

const commentOnPost = (req: any, res: any) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Comment must not be empty" });
  }
  const newComment: NewComment = {
    body: req.body.body,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()).toDate(),
    postId: req.params.postId,
    username: req.user.username,
    userImage: req.user.imageUrl,
    repliesCount: 0,
  };
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }

      return doc.ref.update({ commentCount: doc.data()!.commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then((doc) => {
      res.json({
        body: req.body.body,
        createdAt: Math.floor(new Date().getTime() / 1000),
        postId: req.params.postId,
        username: req.user.username,
        userImage: req.user.imageUrl,
        repliesCount: 0,
        commentId: doc.id,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const replyComment = (req: any, res: any) => {
  if (req.body.body.trim() === "") {
    res.status(400).json({ error: "Reply must not be empty" });
  }
  const newReply: NewReply = {
    body: req.body.body,
    commentId: req.params.commentId,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()).toDate(),
    username: req.user.username,
    userImage: req.user.imageUrl,
  };

  db.doc(`/comments/${req.params.commentId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Comment not found" });
      }

      return doc.ref.update({ repliesCount: doc.data()!.repliesCount + 1 });
    })
    .then(() => {
      return db.collection("replies").add(newReply);
    })
    .then((doc) => {
      res.json({
        body: req.body.body,
        createdAt: Math.floor(new Date().getTime() / 1000),
        commentId: req.params.postId,
        username: req.user.username,
        userImage: req.user.imageUrl,
        replyId: doc.id,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const likePost = (req: any, res: any) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("postId", "==", req.params.postId)
    .limit(1);

  const postDocument = db.doc(`/posts/${req.params.postId}`);
  interface PostLikes {
    username?: string;
    body?: string;
    createdAt?: Date;
    postId?: string;
    userImage?: string;
    likeCount?: number;
    commentCount?: number;
  }
  let postData: PostLikes;
  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data()!;
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            postId: req.params.postId,
            username: req.user.username,
          })
          .then(() => {
            postData.likeCount!++;
            return postDocument.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      } else {
        return res.status(400).json({ error: "Post already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
const unlikePost = (req: any, res: any) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("postId", "==", req.params.postId)
    .limit(1);
  const postDocument = db.doc(`/posts/${req.params.postId}`);
  interface PostLikes {
    username?: string;
    body?: string;
    createdAt?: Date;
    postId?: string;
    userImage?: string;
    likeCount?: number;
    commentCount?: number;
  }
  let postData: PostLikes;
  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data()!;
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Post not liked" });
      } else {
        return db
          .doc(`likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            if (postData.likeCount) postData.likeCount--;
            return postDocument.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            res.json(postData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

const deletePost = (req: any, res: any) => {
  const document = db.doc(`/posts/${req.params.postId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (doc.data()!.username !== req.user.username) {
        return res.status(404).json({ error: "Unauthorized" });
      } else return document.delete();
    })
    .then(() => {
      res.json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

const deleteComment = (req: any, res: any) => {
  const document = db.doc(`/comments/${req.params.commentId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (doc.data()!.username !== req.user.username) {
        return res.status(404).json({ error: "Unauthorized" });
      } else return document.delete();
    })
    .then(() => {
      db.doc(`/posts/${req.params.postId}`)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            return res.status(404).json({ error: "Post not found" });
          }
          console.log(doc.data()!.commentCount);
          return doc.ref.update({ commentCount: doc.data()!.commentCount - 1 });
        });
    })
    .then(() => {
      res.json({ message: "Comment deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

interface SavedPostData {
  postId: string;
  username: string;
  savedPostId?: string;
}
const savePost = (req: any, res: any) => {
  const savedPostData: SavedPostData = {
    postId: req.params.postId,
    username: req.user.username,
  };

  db.collection("savedPosts")
    .where("postId", "==", req.params.postId)
    .where("username", "==", req.user.username)
    .get()
    .then((doc) => {
      if (doc.empty) {
        res.json(savedPostData);
        return db.collection("savedPosts").add(savedPostData);
      } else return res.status(400).json({ error: "Post already saved" });
    })

    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};
const unsavePost = (req: any, res: any) => {
  const savedPostDataDoc = db
    .collection("savedPosts")
    .where("username", "==", req.user.username)
    .where("postId", "==", req.params.postId)
    .limit(1);

  savedPostDataDoc.get().then((data) => {
    if (data.empty) {
      return res.status(404).json({ error: "No saved posts" });
    } else {
      return db
        .doc(`savedPosts/${data.docs[0].id}`)
        .delete()
        .then(() => {
          res.json({ postId: data.docs[0].id, savedPostId: req.params.postId });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
};

const getAllSavedPosts = (req: any, res: any) => {
  const arr2: SavedPostData[] = [];
  const arr: Post[] = [];
  db.collection("savedPosts")
    .where("username", "==", req.user.username)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        if (doc.data().username === req.user.username) {
          arr2.push({
            postId: doc.data().postId,
            username: doc.data().username,
          });
        }
      });
      db.collection("posts")
        .orderBy("createdAt", "desc")
        .get()
        .then((doc2) => {
          if (doc2.empty) {
            return res.status(404).json({ error: "Not found" });
          }

          doc2.forEach((postData) => {
            for (let i = 0; i < arr2.length; i++) {
              if (postData.id === arr2[i].postId) {
                arr.push({
                  postId: postData.id,
                  username: postData.data().username,
                  body: postData.data().body,
                  likeCount: postData.data().likeCount,
                  commentCount: postData.data().commentCount,
                  userImage: postData.data().userImage,
                  createdAt: postData.data().createdAt,
                });
              }
            }
          });
          return res.json(arr);
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

const uploadImagePost = (req: any, res: any) => {
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
      file: any,
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
  interface imagePostDetails {
    imageUrl: string;
    createdAt: Date;
    username: string;
    userImage: string;
    likeCount: number;
    commentCount: number;
  }
  let newImagePost: imagePostDetails;
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

        newImagePost = {
          userImage: req.user.imageUrl,
          createdAt: admin.firestore.Timestamp.fromDate(new Date()).toDate(),
          commentCount: 0,
          likeCount: 0,
          imageUrl: imageUrl,
          username: req.user.username,
        };

        return db.collection(`/posts`).add(newImagePost);
      })
      .then(() => {
        console.log(newImagePost);
        return res.json(newImagePost);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

export {
  getAllPosts,
  postOnePost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost,
  deleteComment,
  editPost,
  editComment,
  savePost,
  unsavePost,
  getAllSavedPosts,
  uploadImagePost,
  replyComment,
  getCommentReplies,
};
