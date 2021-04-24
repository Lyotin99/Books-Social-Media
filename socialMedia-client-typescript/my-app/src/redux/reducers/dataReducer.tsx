import {
  SET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  LOADING_DATA,
  SET_POST,
  POST_POST,
  SUBMIT_COMMENT,
  DELETE_POST,
  EDIT_POST,
  DELETE_COMMENT,
  EDIT_COMMENT,
  SAVE_POST,
  UNSAVE_POST,
  SET_SAVED_POSTS,
  SET_REPLIES,
  POST_REPLY,
  DELETE_REPLY,
  EDIT_REPLY,
} from "../types";

import { InitialStateData } from "../../components/post/postInterfaces";

const initialState: InitialStateData = {
  posts: [],
  post: {
    body: "",
    commentCount: 0,
    comments: [
      {
        body: "",
        createdAt: {
          _nanoseconds: 0,
          _seconds: 0,
        },
        postId: "",
        userImage: "",
        username: "",
        commentId: "",
        repliesCount: 0,
        replies: [
          {
            body: "",
            createdAt: {
              _nanoseconds: 0,
              _seconds: 0,
            },
            replyId: "",
            userImage: "",
            username: "",
            commentId: "",
          },
        ],
      },
    ],
    imageUrl: "",
    createdAt: { _nanoseconds: 0, _seconds: 0 },
    likeCount: 0,
    postId: "",
    userImage: "",
    username: "",
  },
  loading: false,
};
const func = (state = initialState, action: any) => {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SAVED_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };
    case SET_POST:
      return {
        ...state,
        post: action.payload,
      };
    case SAVE_POST:
      return {
        ...state,
      };
    case SET_REPLIES:
      let repliesCounter = 0;
      if (action.payload[0]) {
        for (let i = 0; i < state.post.comments.length; i++) {
          if (
            state.post.comments[i].commentId === action.payload[0].commentId
          ) {
            break;
          }
          repliesCounter++;
        }

        state.post.comments[repliesCounter].replies = action.payload;
      }
      return {
        ...state,
      };
    case DELETE_REPLY:
      let index3 = state.post.comments.findIndex(
        (comment) => comment.commentId === action.payload.commentId
      );

      let replyIndex = state.post.comments[index3].replies.findIndex(
        (reply) => reply.replyId === action.payload.replyId
      );

      state.post.comments[index3].repliesCount--;
      state.post.comments[index3].replies.splice(replyIndex, 1);
      return {
        ...state,
      };
    case EDIT_REPLY:
      const b = state.post.comments.findIndex(
        (com) => com.commentId === action.payload.commentId
      );
      let replyData = state.post.comments[b].replies.filter(
        (reply) => reply.replyId === action.payload.replyId
      );

      replyData[0].body = action.payload.body;

      return {
        ...state,
      };
    case UNSAVE_POST:
      let indexPost = state.posts.findIndex(
        (post) => post.postId === action.payload.savedPostId
      );
      if (window.location.pathname === "/users/saved/")
        state.posts.splice(indexPost, 1);

      return {
        ...state,
      };
    case LIKE_POST:
    case UNLIKE_POST:
      let index = state.posts.findIndex(
        (post) => post.postId === action.payload.postId
      );

      state.posts[index] = action.payload;
      state.post.likeCount = action.payload.likeCount;
      return {
        ...state,
      };
    case EDIT_POST:
      let counter = 0;
      for (let i = 0; i < state.posts.length; i++) {
        if (state.post.postId === state.posts[i].postId) {
          break;
        } else counter++;
      }
      state.posts[counter].body = action.payload;
      state.post.body = action.payload;
      return {
        ...state,
      };
    case EDIT_COMMENT:
      const a = state.post.comments.filter(
        (com) => com.commentId === action.payload.commentId
      );
      a[0].body = action.payload.body;

      return {
        ...state,
        post: {
          ...state.post,
          comments: [...state.post.comments],
        },
      };
    case POST_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case POST_REPLY:
      let repliesCounter1 = 0;
      for (let i = 0; i < state.post.comments.length; i++) {
        if (state.post.comments[i].commentId === action.payload.commentId) {
          break;
        }
        repliesCounter1++;
      }

      state.post.comments[repliesCounter1].replies.push(action.payload);
      state.post.comments[repliesCounter1].repliesCount++;

      return {
        ...state,
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: [action.payload, ...state.post.comments],
        },
      };

    case DELETE_POST:
      let index1 = state.posts.findIndex(
        (post) => post.postId === action.payload
      );
      state.posts.splice(index1, 1);
      return {
        ...state,
      };

    case DELETE_COMMENT:
      let index2 = state.post.comments.findIndex(
        (comment) => comment.commentId === action.payload
      );
      state.post.commentCount--;
      state.post.comments.splice(index2, 1);
      return {
        ...state,
        post: {
          ...state.post,
          comments: [...state.post.comments],
        },
      };
    default:
      return state;
  }
};

export default func;
