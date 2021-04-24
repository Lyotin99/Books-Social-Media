import {
  SET_POSTS,
  LOADING_DATA,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  LOADING_UI,
  POST_POST,
  CLEAR_ERRORS,
  SET_ERRORS,
  SET_POST,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
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

import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
} from "../../util/BackendServices";
import { Dispatch } from "redux";

interface NewPostData {
  body: string;
}
interface CommentsData {
  body: string;
}
//Get all posts
export const getSavedPosts = () => (dispatch: Dispatch) => {
  dispatch({ type: LOADING_DATA });
  axiosGet("/saved")
    .then((res) => {
      dispatch({ type: SET_SAVED_POSTS, payload: res.data });
    })
    .catch((err) => {
      dispatch({
        type: SET_POSTS,
        payload: [],
      });
    });
};

export const getPosts = () => (dispatch: Dispatch) => {
  dispatch({ type: LOADING_DATA });
  axiosGet("/posts")
    .then((res) => {
      dispatch({ type: SET_POSTS, payload: res.data });
    })
    .catch((err) => {
      dispatch({
        type: SET_POSTS,
        payload: [],
      });
    });
};
export const PostReply = (commentId: string, replyData: CommentsData) => (
  dispatch: Dispatch<any>
) => {
  axiosPost(`/comments/${commentId}/replies`, replyData)
    .then((res) => {
      dispatch({
        type: POST_REPLY,
        payload: res.data,
      });
      dispatch(cleanErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getReplies = (commentId: string) => (dispatch: Dispatch) => {
  dispatch({ type: LOADING_DATA });
  axiosGet(`/comments/${commentId}`)
    .then((res) => {
      dispatch({ type: SET_REPLIES, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteReply = (commentId: string, replyId: string) => (
  dispatch: Dispatch
) => {
  axiosDelete(`/comments/${commentId}/reply/${replyId}`)
    .then(() => {
      dispatch({ type: DELETE_REPLY, payload: { commentId, replyId } });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const editReply = (replyId: string, body: CommentData) => (
  dispatch: Dispatch
) => {
  axiosPut(`/reply/${replyId}`, body)
    .then((res) => {
      dispatch({
        type: EDIT_REPLY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};
export const createPost = (newPost: NewPostData) => (
  dispatch: Dispatch<any>
) => {
  dispatch({ type: LOADING_UI });
  axiosPost(`/posts`, newPost)
    .then((res) => {
      dispatch({
        type: POST_POST,
        payload: res.data,
      });
      dispatch(cleanErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

//Submit comment

export const submitComment = (postId: string, commentData: CommentsData) => (
  dispatch: Dispatch<any>
) => {
  axiosPost(`/post/${postId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(cleanErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

//Save a post
export const savePost = (postId: string) => (dispatch: Dispatch) => {
  axiosGet(`/saved/${postId}`)
    .then((res) => {
      dispatch({
        type: SAVE_POST,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const unSavePost = (postId: string) => (dispatch: Dispatch) => {
  axiosGet(`/unsaved/${postId}`)
    .then((res) => {
      dispatch({
        type: UNSAVE_POST,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//Like a post
export const likePost = (postId: string) => (dispatch: Dispatch) => {
  axiosGet(`/post/${postId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_POST,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const unlikePost = (postId: string) => (dispatch: Dispatch) => {
  axiosGet(`/post/${postId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_POST,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getPost = (postId: string) => (dispatch: Dispatch) => {
  dispatch({ type: LOADING_UI });
  axiosGet(`/post/${postId}`)
    .then((res) => {
      dispatch({
        type: SET_POST,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const editPost = (postId: string, body: string) => (
  dispatch: Dispatch
) => {
  axiosPut(`/post/${postId}`, { body })
    .then((res) => {
      dispatch({
        type: EDIT_POST,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};
interface CommentData {
  body: string;
}
export const editComment = (commentId: string, body: CommentData) => (
  dispatch: Dispatch
) => {
  axiosPut(`/comment/${commentId}`, body)
    .then((res) => {
      dispatch({
        type: EDIT_COMMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};
export const deletePost = (postId: string) => (dispatch: Dispatch) => {
  axiosDelete(`/post/${postId}`)
    .then(() => {
      dispatch({ type: DELETE_POST, payload: postId });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteComment = (postId: string, commentId: string) => (
  dispatch: Dispatch
) => {
  axiosDelete(`/post/${postId}/comment/${commentId}`)
    .then(() => {
      dispatch({ type: DELETE_COMMENT, payload: commentId });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const cleanErrors = () => (dispatch: Dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export const getUserData = (username: string) => (dispatch: Dispatch) => {
  dispatch({ type: LOADING_DATA });
  axiosGet(`/user/${username}`)
    .then((res) => {
      dispatch({ type: SET_POSTS, payload: res.data.posts });
    })
    .catch(() => {
      dispatch({ type: SET_POSTS, payload: null });
    });
};
