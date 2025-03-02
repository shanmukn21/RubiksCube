const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000; 

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index"); 
});

app.get("/solve", async (req, res) => {
    const cubeState = req.query.cubeState;
    if (!cubeState) {
        return res.status(400).json({ error: "Cube state is required" });
    }

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
            ],
            executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        });


        const page = await browser.newPage();

        await page.goto(`https://rubikscu.be/solver/?cube=0${cubeState}`, { waitUntil: "networkidle2" });

        await page.waitForSelector("#solution span", { timeout: 30000 });

        const solutionSteps = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#solution span"))
                .map(span => span.textContent)
                .join(" ");
        });

        await browser.close();
        res.json({ solution: solutionSteps });

    } catch (error) {
        console.error("Error solving cube:", error);
        res.status(500).json({ error: "Failed to fetch solution" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 