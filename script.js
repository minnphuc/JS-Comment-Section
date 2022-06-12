"use strict";

//? ----SELECT DOM ELEMENT----
const commentSection = document.querySelector(".comment_section");
const commentInput = document.querySelector(".input_comment");
const commentBox = document.querySelector(".comment_box");
const post = document.querySelector(".post");

const heartBtn = document.querySelector("i:first-child");
const commentBtn = document.querySelector("i:nth-child(2)");
const sendBtn = document.querySelector(".send_btn");
const replyBtn = document.getElementsByClassName("reply_btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".filter");

//? ----COMMENT OBJECT----

class Comment {
  constructor(
    inputText,
    createdAt = "just now",
    score = 0,
    username = "juliusomo",
    image = "./images/avatars/image-juliusomo.png",
    replies = []
  ) {
    this.content = inputText;
    this.createdAt = createdAt;
    this.score = score;
    this.username = username;
    this.image = image;
    this.replies = replies;
  }

  checkReplies() {
    if (this.replies) return true;
    return false;
  }
}

class ReplyComment extends Comment {
  constructor(inputText, replyTo) {
    super(inputText);
    this.replyTo = replyTo;
  }
}

//? ----APPLICATION ARCHITECTURE----

class App {
  #comments = [];
  #allDOMComment;
  #deletedComment;

  //! **INITIAL**
  constructor() {
    //? Add comment data from JSON
    this.#comments.push(comment1);
    this.#comments.push(comment2);
    this.#comments.push(comment3);

    //? Load exist comment
    this._loadComment();

    this.#allDOMComment = document.querySelectorAll(".comment");
    this._loadReply();

    //? Adding event listener
    // POST
    commentBtn.addEventListener("click", this._displayCommentSection);
    heartBtn.addEventListener("click", function () {
      this.classList.toggle("red_heart");
    });

    // COMMENT
    sendBtn.addEventListener("click", this._createComment.bind(this));
    commentSection.addEventListener("click", this._displayReplyBox.bind(this));
    commentSection.addEventListener("click", this._submitReplyBox.bind(this));
    commentSection.addEventListener("click", this._upDownVote.bind(this));
    commentSection.addEventListener("click", this._displayDelModal.bind(this));
    modal.addEventListener("click", this._deleteComment.bind(this));
    commentSection.addEventListener("click", this._displayEditBox.bind(this));
    commentSection.addEventListener("click", this._submitEditBox.bind(this));
  }

  //! ----FEATURES METHOD----

  //todo ***HELPER FUNCTION***
  _displayCommentSection() {
    post.style.transform = "translateY(0)";
    commentSection.style.display = "block";
    commentInput.style.display = "flex";

    setTimeout(() => (commentSection.style.opacity = "1"), 300);
  }

  _checkUser(user) {
    return user === "me"
      ? `<p class="delete_edit_container">
            <span class="delete_btn"><img src="images/icon-delete.svg"> Delete</span>
            <span class="edit_btn"><img src="images/icon-edit.svg"> Edit</span>
          </p>`
      : `<p class="reply_btn"><img src="images/icon-reply.svg"> Reply</p>`;
  }

  //todo ***MAIN FUNCTION***

  //? ----CREATE COMMENT OBJECT----

  _createComment() {
    const commentText = commentBox.value;
    commentBox.value = "";

    const comment = new Comment(commentText);
    this.#comments.push(comment);
    this._renderComment(comment, "me");
  }

  //? ----RENDER COMMENT----

  _renderComment(comment, user) {
    const button = this._checkUser(user);
    const you = `<p class="you">you</p>`;

    //? Comment HTML
    const html = `
    <div class="comment">

      <div class="vote">
        <p class="upvote">+</p>
        <p class="num_vote">${comment.score}</p>
        <p class="downvote">-</p>
      </div>

      <div class="comment_content">
        <div class="info">
          <div class="avatar"><img src="${comment.image}"></div>
          <p class="name">${comment.username}</p>
          ${user === "me" ? you : ""}
          <p class="date">${comment.createdAt}</p>
          ${button}
        </div>
  
        <div class="content">
          ${comment.content}
        </div>
      </div>
    </div>
    <hr style="margin-top: 1rem; margin-bottom: 2rem;color: var(--moderate-blue);">
    `;

    commentSection.insertAdjacentHTML("beforeend", html);
  }

  _renderReply(repliedComment, repComment, user) {
    const button = this._checkUser(user);
    const you = `<p class="you">you</p>`;

    //? Reply Comment HTML
    const html = `
    <div class="reply_comment">

        <div class="vote">
          <p class="upvote">+</p>
          <p class="num_vote">${repComment.score}</p>
          <p class="downvote">-</p>
        </div>
  
        <div class="comment_content">
          <div class="info_reply">
            <div class="avatar"><img src="${repComment.image}"></div>
            <p class="name">${repComment.username}</p>
            ${user === "me" ? you : ""}
            <p class="date">${repComment.createdAt}</p>
            ${button}
          </div>
    
          <div class="content">
            <span class="reply_name">@${repComment.replyTo}</span> ${
      repComment.content
    }
          </div>
        </div>
    </div>
    `;

    // Thêm reply vào cuối cuộc trò chuyện
    let horizontal = repliedComment;
    while (horizontal.localName !== "hr")
      horizontal = horizontal.nextElementSibling;

    horizontal.insertAdjacentHTML("beforebegin", html);
  }

  //? ----LOAD EXIST COMMENT FROM JSON----

  _loadComment() {
    this.#comments.forEach(comment => this._renderComment(comment, "another"));
  }

  _loadReply() {
    this.#comments.forEach((comment, i) => {
      if (!comment.checkReplies()) return;

      comment.replies.forEach(reply =>
        this._renderReply(
          this.#allDOMComment[i],
          reply,
          reply.username === "juliusomo" ? "me" : "another"
        )
      );
    });
  }

  //? ----DISPLAY AND SUBMIT REPLY BOX----

  _displayReplyBox(e) {
    if (!e.target.classList.contains("reply_btn")) return;

    let repliedComment = e.target.closest(".comment");
    if (!repliedComment) repliedComment = e.target.closest(".reply_comment");

    //? Reply Box HTML
    const html = `
    <div class="input_comment" style="opacity: 0">
      <div class="avatar" style="align-self: flex-start;"><img src="./images/avatars/image-juliusomo.png"></div>
      <textarea class="comment_box" name="comment" rows="4" cols="50" placeholder="Enter your reply..."></textarea>
      <button class="send_btn">REPLY</button>
    </div>
    `;
    // Display Reply Box
    repliedComment.insertAdjacentHTML("afterend", html);

    // ANIMATION
    setTimeout(() => {
      const replyBox = repliedComment.nextElementSibling;
      const boxText = replyBox.children[1];
      replyBox.style.opacity = "1";
      setTimeout(() => boxText.focus(), 500);
    }, 140);
  }

  _submitReplyBox(e) {
    if (!e.target.classList.contains("send_btn")) return;

    const replyBox = e.target.closest(".input_comment");
    const replyText = e.target.previousElementSibling.value;

    const repliedComment = replyBox.previousElementSibling;
    const tagName =
      repliedComment.children[1].children[0].children[1].textContent;

    // Create rep comment
    const replyComment = new ReplyComment(replyText, tagName);
    // Render rep comment
    this._renderReply(repliedComment, replyComment, "me");

    // Hide Reply Box
    replyBox.remove();
  }

  //? ----UP DOWN VOTE----

  _upDownVote(e) {
    if (e.target.classList.contains("upvote"))
      e.target.nextElementSibling.textContent++;

    if (e.target.classList.contains("downvote"))
      e.target.previousElementSibling.textContent--;
  }

  //? ----DISPLAY AND SUBMIT DELETE MODAL----

  _displayDelModal(e) {
    if (!e.target.classList.contains("delete_btn")) return;

    let deletedComment = e.target.closest(".comment");
    if (!deletedComment) deletedComment = e.target.closest(".reply_comment");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    this.#deletedComment = deletedComment;
  }

  _deleteComment(e) {
    if (e.target.classList.contains("del")) {
      // Remove Horizontal Line
      if (this.#deletedComment.classList.contains("comment"))
        this.#deletedComment.nextElementSibling.remove();

      this.#deletedComment.remove();
      modal.classList.add("hidden");
      overlay.classList.add("hidden");
    }

    if (e.target.classList.contains("cancel")) {
      modal.classList.add("hidden");
      overlay.classList.add("hidden");
    }
  }

  //? ----DISPLAY AND SUBMIT EDIT BOX----

  _displayEditBox(e) {
    if (!e.target.classList.contains("edit_btn")) return;

    let editedComment = e.target.closest(".comment");
    if (!editedComment) editedComment = e.target.closest(".reply_comment");

    const content = editedComment
      .querySelector("div:last-child")
      .querySelector("div:last-child");
    const oldComm = content.innerText;

    //? Edit Box HTML
    const html = `
    <textarea class="comment_box" name="comment" rows="4" cols="60" style="width: 100%; height: 10rem;">${oldComm}</textarea>
    <button class="update_btn">UPDATE</button>
    `;

    content.insertAdjacentHTML("afterend", html);
    content.nextElementSibling.focus();
    content.remove();
  }

  _submitEditBox(e) {
    if (!e.target.classList.contains("update_btn")) return;

    const updateBtn = e.target;
    const editBox = updateBtn.previousElementSibling;

    const updatedComm = editBox.value;
    const comment = updatedComm.slice(updatedComm.indexOf(" "));
    const tagName = updatedComm.split(" ")[0];

    //? Update Comment HTML
    const html = updateBtn.closest(".comment")
      ? `<div class="content">${updatedComm}</div>`
      : `<div class="content"><span class="reply_name">${tagName}</span> ${comment}</div>`;

    editBox.insertAdjacentHTML("beforebegin", html);
    editBox.remove();
    updateBtn.remove();
  }
}

//! GET/CREATE COMMENT DATA

let comment1, comment2, comment3;

const getCommentData = async function () {
  const res = await fetch("data.json");
  const data = await res.json();
  return data.comments;
};

const createCommentData = async function () {
  const commentData = await getCommentData();

  const commentObj = commentData.map(comment => {
    const content = comment.content;
    const createdAt = comment.createdAt;
    const score = comment.score;
    const username = comment.user.username;
    const image = comment.user.image.png;
    const replies = comment.replies;

    return new Comment(content, createdAt, score, username, image, replies);
  });

  [comment1, comment2, comment3] = commentObj;

  //todo INITIAL APPLICATION AFTER RETRIEVE DATA FROM JSON FILE
  const app = new App();
};

createCommentData();
