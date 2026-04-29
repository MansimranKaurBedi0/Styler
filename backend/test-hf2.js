const { HfInference } = require("@huggingface/inference");
const hf = new HfInference();
async function test() {
  try {
    const res = await hf.imageToText({
      data: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"), // tiny image
      model: "nlpconnect/vit-gpt2-image-captioning"
    });
    console.log(res);
  } catch (e) {
    console.error(e.message);
  }
}
test();
