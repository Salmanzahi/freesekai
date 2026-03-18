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
  spotifyTrack?: string;
  songTrack?: trackData | null;
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




/**
 * Track data interface
 * @interface trackData
 * @property {string} wrapperType - The type of the wrapper
 * @property {string} kind - The kind of the track
 * @property {number} artistId - The ID of the artist
 * @property {number} collectionId - The ID of the collection
 * @property {number} trackId - The ID of the track
 * @property {string} artistName - The name of the artist
 * @property {string} collectionName - The name of the collection
 * @property {string} trackName - The name of the track
 * @property {string} collectionCensoredName - The censored name of the collection
 * @property {string} trackCensoredName - The censored name of the track
 * @property {string} artistViewUrl - The URL of the artist
 * @property {string} collectionViewUrl - The URL of the collection
 * @property {string} trackViewUrl - The URL of the track
 * @property {string} previewUrl - The URL of the preview
 * @property {string} artworkUrl30 - The URL of the artwork
 * @property {string} artworkUrl60 - The URL of the artwork
 * @property {string} artworkUrl100 - The URL of the artwork
 * @property {string} releaseDate - The release date of the track
 * @property {string} collectionExplicitness - The explicitness of the collection
 * @property {string} trackExplicitness - The explicitness of the track
 * @property {number} discCount - The number of discs
 * @property {number} discNumber - The number of the disc
 * @property {number} trackCount - The number of tracks
 * @property {number} trackNumber - The number of the track
 * @property {number} trackTimeMillis - The time of the track in milliseconds
 * @property {string} country - The country of the track
 * @property {string} currency - The currency of the track
 * @property {string} primaryGenreName - The primary genre name of the track
 * @property {boolean} isStreamable - Whether the track is streamable
 */
 export interface trackData {
    wrapperType: string;
    kind: string;
    artistId: number;
    collectionId: number;
    trackId: number;
    artistName: string;
    collectionName: string;
    trackName: string;
    collectionCensoredName: string;
    trackCensoredName: string;
    artistViewUrl: string;
    collectionViewUrl: string;
    trackViewUrl: string;
    previewUrl: string;
    artworkUrl30: string;
    artworkUrl60: string;
    artworkUrl100: string;
    releaseDate: string;
    collectionExplicitness: string;
    trackExplicitness: string;
    discCount: number;
    discNumber: number;
    trackCount: number;
    trackNumber: number;
    trackTimeMillis: number;
    country: string;
    currency: string;
    primaryGenreName: string;
    isStreamable: boolean;
 }