import { utapi } from "@/lib/utapi";

async function DeleteFile() {
  const res = await utapi.deleteFiles(
    "Ni5eCCavBWD955bqwa7wpzQ0geNTm6rMRZkK7xJFL2Xd19hE",
  );
  return res;
}
export default async function News() {
  const res = await DeleteFile();
  console.log(res);
  return <div>News</div>;
}
