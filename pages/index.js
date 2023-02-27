import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [results, setResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setPromptInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI TEST</title>
      </Head>

      <main className={styles.main}>
        <h3>OpenAI TEST</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="prompt"
            placeholder="Enter an prompt"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <input type="submit" value="Generate Images" />
        </form>
        <div style={{display:"flex", flexDirection:"row", flexWrap: "wrap", marginTop: "30px"}}>
        {results.map(result=>(
          <div style={{width: "50%"}}>
            <img style={{width: "100%"}} src={result}/>
          </div>
        ))}
        </div>
      </main>
    </div>
  );
}
