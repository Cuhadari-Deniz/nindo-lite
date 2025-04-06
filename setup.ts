import * as fs from "fs";
import * as path from "path";

// Directories containing .env.example files
const directories = ["./apps/backend", "./apps/frontend"];

/**
 * Copies the .env.example file to .env in the specified directory
 * @param dir Directory path containing .env.example
 */
function copyEnvFile(dir: string): void {
  const examplePath = path.join(dir, ".env.example");
  const envPath = path.join(dir, ".env");

  try {
    // Check if .env.example exists
    if (!fs.existsSync(examplePath)) {
      console.error(`❌ ${examplePath} does not exist!`);
      return;
    }

    // Read the .env.example file
    const content = fs.readFileSync(examplePath, "utf8");

    // Write the content to the .env file
    fs.writeFileSync(envPath, content);
    console.log(`✅ Created ${envPath}`);
  } catch (error) {
    console.error(`❌ Error copying env file in ${dir}:`, error);
  }
}

// Process each directory
console.log("🔄 Setting up environment files...");
directories.forEach(copyEnvFile);
console.log("✨ Environment setup complete!");
