import { Timestamp } from 'firebase/firestore';

/**
 * Reply interface
 * @interface Reply
 * @property {string} id - The unique identifier of the reply
 * @property {Timestamp | null} createdAt - The timestamp when the reply was created
 * @property {string} text - The text of the reply
 * @property {string} userId - The unique identifier of the user who created the reply
 */
export interface Reply {
  id: string;
  createdAt: Timestamp | null;
  text: string;
  userId: string;
}// ─── Types ───────────────────────────────────────────────


/**
 * Post interface
 * @interface Post
 * @property {string} id - The unique identifier of the post
 * @property {string} body - The body of the post
 * @property {Timestamp} createdAt - The timestamp when the post was created
 * @property {string | null} image - The URL of the image associated with the post
 * @property {File | null} imageFile - The file object of the image associated with the post
 * @property {boolean} showProfile - Whether to show the profile of the user who created the post
 * @property {string} spotifyTrack - The Spotify track associated with the post
 * @property {string} title - The title of the post
 * @property {string} userId - The unique identifier of the user who created the post
 * @property {number | undefined} like - The number of likes on the post
 */
export interface Post {

 
  id: string
  body: string;
  createdAt: Timestamp;
  image: string | null;
  imageFile: File | null;
  showProfile: boolean;
  spotifyTrack: string;
  title: string;
  userId: string;
  like?: number;
}

/**
 * User interface
 * @interface UserData
 * @property {string} username - The username of the user
 * @property {string | null} photoURL - The URL of the user's profile photo
 * @property {Timestamp} createdAt - The timestamp when the user was created
 */
export interface UserData {
  username: string;
  photoURL: string | null;
  createdAt: Timestamp;
}

