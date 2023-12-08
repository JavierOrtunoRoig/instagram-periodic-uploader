import playwright from "playwright";
import posts from "./posts.json" assert { type: "json" } ;
import fs from "fs";

const username = "naru_luffy";
const password = "javier11";

async function createPost() {

   const browser = await playwright.chromium.launch({
      headless: true,
      slowMo: 50,
   });
   const context = await browser.newContext();
   const page = await context.newPage();
   await page.goto("https://www.instagram.com/");

   await page.click("text=Permitir todas las cookies");
   
   await page.fill("input[name='username']", username);
   await page.fill("input[name='password']", password);
   
   await page.click("button[type='submit']");

   await page.click("text=Crear");

   const postToUpload = posts.find((post) => post.uploaded === false);

   await page.setInputFiles('input[type="file"]', postToUpload.path);

   await page.click("text=Siguiente");

   await page.click("text=Siguiente");

   await page.fill("div[role='textbox']", postToUpload.description);

   await page.click("text=Compartir");

   await page.waitForTimeout(5000);

   await browser.close();

   console.log("Post uploaded successfully");
   const newPostsArray = posts.map((post) => {
      if (post.path === postToUpload.path) {
         post.uploaded = true;
      }
      return post;
   });
   
   fs.writeFileSync("./posts.json", JSON.stringify(newPostsArray, null, 2));

}

createPost();
