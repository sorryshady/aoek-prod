import { utapi } from "@/lib/utapi";

async function GetFiles() {
  const res = await utapi.listFiles();
  return res;
}
export default async function Gallery() {
  //   const data = await GetFiles();
  //   console.log(data.files[0]);
  return <div>Gallery</div>;
}
