import { Component, OnInit } from '@angular/core';
import { QiscusService, Comment, Selected } from '../qiscus.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-qiscus',
  templateUrl: './qiscus.component.html',
  styleUrls: ['./qiscus.component.css']
})
export class QiscusComponent implements OnInit {

  room?: Selected;
  newCommentSubscription: Subscription;
  _comments: Record<string, Comment> = {};

  get comments(): Comment[] {
    return Object.values(this._comments)
  }

  constructor(private qiscusService: QiscusService) { }

  ngOnInit(): void {

    this.qiscusService.initiate()
      .toPromise().then((room) => {
        console.log('success')
        console.log(room)

        this.room = room;
        for (let c of room.comments) {
          this._comments[c.unique_id] = c
        }
      });

    (window as any).qiscusService = this.qiscusService;
    (window as any).qiscusComponent = this;


    this.newCommentSubscription = this.qiscusService.newComment$
    .pipe(tap((c) => console.log('got comment:', c)))
    .subscribe((comment: any) => {
      this._comments[comment.unique_temp_id] = comment
    })

  }

  ngOnDestroy() {
    this.newCommentSubscription?.unsubscribe()
  }


  sendMessage(text: string): void {
    this.qiscusService.sendMessage({
      message: text,
      roomId: this.room.id,
      extras: null,
      payload: null,
      type: 'text',
      uniqueId: String(Date.now()),
    });
  }

}
