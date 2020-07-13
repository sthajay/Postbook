import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], totalPosts: number }>();
  // private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; posts: any, maxPosts: number }>(
      'http://localhost:3000/api/posts' + queryParams
    )
      .pipe(map(
        (postData) => {

          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator:post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        }))
      .subscribe(
        transformedPostsData => {
          console.log(transformedPostsData);
          this.posts = transformedPostsData.posts;
          // this.postsUpdated.next(this.posts);
          this.postsUpdated.next({ posts: [...this.posts], totalPosts: transformedPostsData.maxPosts });
        }
      );

  }
  // getPosts() {
  //   this.http.get<{ message: string; posts: any }>(
  //     'http://localhost:3000/api/posts'
  //   )
  //     .pipe(map((postData) => {
  //       return postData.posts.map(post => {
  //         return {
  //           title: post.title,
  //           content: post.content,
  //           id: post._id,
  //           imagePath: post.imagePath
  //         };
  //       });
  //     }))
  //     .subscribe(
  //       transformedPosts => {
  //         this.posts = transformedPosts;
  //         // this.postsUpdated.next(this.posts);
  //         this.postsUpdated.next([...this.posts]);
  //       }
  //     );

  // }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPostById(id: string) {
    return this.http.get<{ post: Post; message: string }>(
      'http://localhost:3000/api/posts/' + id);
  }

  addPost(userTitle: string, userContent: string, image: File) {
    // const post: Post = { id: null, title: userTitle, content: userContent };
    const postData = new FormData();
    postData.append("title", userTitle);
    postData.append("content", userContent);
    postData.append("image", image, userTitle);
    this.http.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData).
      subscribe(resData => {

        this.router.navigate(['/']);
      });
  }

  updatePost(userId: string, userTitle: string, userContent: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", userId);
      postData.append("title", userTitle);
      postData.append("content", userContent);
      postData.append("image", image);
    } else {
      postData = {
        id: userId,
        title: userTitle,
        content: userContent,
        imagePath: image,
        creator:null
      };
    }
    return this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + userId, postData);


  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId);
  }



}
