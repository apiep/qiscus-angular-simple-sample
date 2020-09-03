import { Injectable } from '@angular/core';
import QiscusSDK from 'qiscus-sdk-core';
import { Subject, Observable, from } from 'rxjs';
import { flatMap, distinctUntilChanged } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class QiscusService {

  private qiscus: QiscusSDK
  private appId = 'sdksample';
  private isLogin$: Subject<boolean> = new Subject();
  private _newComment$ = new Subject<Comment>();

  get newComment$() {
    return this._newComment$.pipe(
      // distinctUntilChanged((c1, c2) => c1.id === c2.id)
    )
  }

  constructor() {
    (window as any).QiscusSDK = QiscusSDK;
    this.qiscus = new QiscusSDK();
    (window as any).qiscus = this.qiscus;

    this.qiscus.init({
      AppId: this.appId,
      options: {
        loginSuccessCallback: (data) => {
          this.isLogin$.next(data)
          this.isLogin$.complete()
        },
        loginErrorCallback(data) {},
        newMessagesCallback: (data: Comment[]) => {
          for (let comment of data) {
            this._newComment$.next(comment)
          }
        },
        presenceCallback(data) {
          const presenceData = `${data}`.split(':');
          const lastSeen = presenceData[1];
          // store.dispatch(new messagingActions.UpdateOnlineStatus(lastSeen));
        },
        commentReadCallback(data) {
          // store
          //   .select<string>((state) => state.messaging.roomId)
          //   .pipe(
          //     take(1),
          //     tap((roomId) =>
          //       store.dispatch([new messagingActions.SetCurrentRoomId(roomId)])
          //     )
          //   )
          //   .subscribe();
        },
      }
    })
  }

  initiate(): Observable<any> {
    const userId = 'guest-1001'
    const userKey = 'passkey'
    this.qiscus.setUser(userId, userKey)
    return this.isLogin$.pipe(
      flatMap((_) => from(this.qiscus.chatTarget('guest-101'))),
    )
  }

  sendMessage(qiscusModel: QiscusModel): Promise<Comment> {
    if (qiscusModel.roomId && (qiscusModel.message || qiscusModel.payload)) {
      return this.qiscus.sendComment(
        qiscusModel.roomId,
        qiscusModel.message,
        qiscusModel.uniqueId,
        qiscusModel.type,
        qiscusModel.payload,
        qiscusModel.extras
      );
    }
  }
}

interface QiscusModel {
  roomId: number
  message: string
  uniqueId: string
  type: string
  payload: Record<string, any>
  extras: Record<string, any>
}

export type Selected = {
  id: number;
  last_comment_id: number;
  last_comment_message: string;
  avatar: string;
  name: string;
  room_type: string;
  participants: Participant[];
  options: string;
  topics: any[];
  comments: Comment[];
  count_notif: number;
  isLoaded: boolean;
  unread_comments: any[];
  custom_title: null;
  custom_subtitle: null;
  unique_id: string;
  isChannel: boolean;
  participantNumber: number;
  // additional
  isResolved?: boolean;
};

export type Comment = {
  id: number;
  before_id: number;
  message: string;
  username_as: string;
  username_real: string;
  date: Date;
  time: string;
  timestamp: Date;
  unique_id: string;
  avatar: string;
  room_id: number;
  isChannel: boolean;
  unix_timestamp: number;
  is_deleted: boolean;
  isPending: boolean;
  isFailed: boolean;
  isDelivered: boolean;
  isRead: boolean;
  isSent: boolean;
  attachment: null;
  payload: Record<string, any>;
  status: Status;
  type: CommentType;
  subtype: null;
  extras: Record<string, any>;
};

export type Payload = {
  replied_comment_id?: number;
  replied_comment_is_deleted?: boolean;
  replied_comment_message?: string;
  replied_comment_payload?: RepliedCommentPayload;
  replied_comment_sender_email?: string;
  replied_comment_sender_username?: string;
  replied_comment_type?: string;
  text?: string;
  // payload custom
  caption?: string;
  file_name?: string;
  size?: number;
  url?: string;
};

export type RepliedCommentPayload = {
  url?: string;
  caption?: string;
  file_name?: string;
  size?: number;
  pages?: number;
  encryption_key?: string;
};

export enum Status {
  Read = 'read',
  Sent = 'sent'
}

export enum CommentType {
  Reply = 'reply',
  Text = 'text',
  Buttons = 'buttons',
  Card = 'card',
  Carousel = 'carousel',
  Custom = 'custom',
  FileAttachment = 'file_attachment',
  SystemEvent = 'system_event',
  Image = 'image'
}

export type Participant = {
  avatar_url: string;
  email: string;
  extras: Extras;
  id: number;
  id_str: string;
  last_comment_read_id: number;
  last_comment_read_id_str: string;
  last_comment_received_id: number;
  last_comment_received_id_str: string;
  username: string;
};

export type Extras = {};

export type RoomType = 'single' | 'group';

export type Room = {
  id: number;
  last_comment_id: number;
  last_comment_message: string;
  last_comment_message_created_at: Date;
  avatar: string;
  name: string;
  room_type: RoomType;
  options: string;
  topics: any[];
  comments: any[];
  count_notif: number;
  isLoaded: boolean;
  unread_comments: any[];
  custom_title: null;
  custom_subtitle: null;
  unique_id: string;
  isChannel: boolean;
  is_resolved?: boolean;
  type?: ChannelType;
  participants?: Participant[];
};

export type ChannelType = 'facebook' | 'line' | 'whatsapp' | 'telegram';
