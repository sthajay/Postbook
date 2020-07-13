import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostsService } from "../../services/posts.service";
import { mimeType } from './mime-type.validator';


@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  editMode: boolean = false;
  id: string = null;
  isLoading: boolean = false;
  postForm: FormGroup;
  imagePreview: string = null;
  post: Post = {
    id: '',
    title: '',
    content: '',
    imagePath: '',
    creator: ''
  };

  constructor(private postsService: PostsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.onInit();
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.isLoading = true;
        if (this.id) {
          this.editMode = true;
          this.postsService.getPostById(this.id)
            .subscribe(
              postData => {
                this.post = {
                  id: postData.post.id,
                  title: postData.post.title,
                  content: postData.post.content,
                  imagePath: postData.post.imagePath,
                  creator: postData.post.creator
                };
                this.postForm.setValue({
                  'title': this.post.title,
                  'content': this.post.content,
                  'image': this.post.imagePath
                });
                this.isLoading = false;
              }
            );
        }
        else {
          this.isLoading = false;
          this.editMode = false;
          this.id = null;
        }
      }
    );

  }

  onInit() {
    this.postForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'image': new FormControl(null, Validators.required, mimeType),
      'content': new FormControl(null, Validators.required)
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({
      'image': file
    });
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader;
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAddPost(): void {
    if (this.postForm.invalid) {
      return;
    }
    // this.isLoading = true;
    const value = this.postForm.value;
    if (this.editMode) {
      this.postsService.updatePost(this.id, value.title, value.content, value.image)
        .subscribe(data => {
          console.log('Ajay dai ', data.message);

          this.router.navigate(['/']);
        }

        );
    } else {
      this.postsService.addPost(value.title, value.content, value.image);
      this.isLoading = true;
      this.postForm.reset();

    }

  }
}
