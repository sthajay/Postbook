import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from "../../models/post.model";
import { PostsService } from "../../services/posts.service";


@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading: boolean = false;
  totalPosts: number = 0;
  postsPerPage: number = 2;
  currentPage: number = 1;
  userId: string;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  private postsSubscription: Subscription;
  private authSubscription: Subscription;
  isAuthenticated: boolean = false;



  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsSubscription = this.postsService.getPostUpdateListener()
      .subscribe(
        (postData: { posts: Post[], totalPosts: number }) => {
          this.isLoading = false;
          this.posts = postData.posts;
          this.totalPosts = postData.totalPosts;
        });
    this.isAuthenticated = this.authService.getIsAuth();
    this.authSubscription = this.authService.getAuthListener()
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        this.userId = this.authService.getUserId();

      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.isLoading = false;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
