export interface Post {
  //etti garyo vane mongo db ma vakae _id use garnu milxa ani pipe use garera map garnu pardaina posts.service.ts ma getposts() garda
  // _id:string;

  id:string;
  title: string;
  imagePath:string;
  content: string;
  creator:string;

}
