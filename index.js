import playwright from "playwright";
import posts from "./posts.json" assert { type: "json" } ;
import fs from "fs";

const username = "naru_luffy";
const password = "javier11";

async function createPost() {

   const browser = await playwright.chromium.launch({
      headless: true,
      slowMo: 50,
      locale: "en-GB"
   });
   const context = await browser.newContext();
   const page = await context.newPage();
   await page.goto("https://www.instagram.com/");

   // await page.click('._a9_0');
   
   await page.fill("input[name='username']", username);
   await page.fill("input[name='password']", password);
   
   await page.click("button[type='submit']");

   await page.screenshot({ path: 'screenshots/screenshot.png' });
   await page.click("text=Crear");

   const postToUpload = posts.find((post) => post.uploaded === false);

   await page.setInputFiles('input[type="file"]', postToUpload.path);

   await page.click("text=Next");

   await page.click("text=Next");

   await page.fill("div[role='textbox']", postToUpload.description);

   await page.click("text=Share");

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
