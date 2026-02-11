# RQ3 — LLM-assisted Text CAPTCHA Demo (VueJS Service + Standalone Scripts)

This repository contains the **RQ3** component of a Master’s thesis project: a small **VueJS-integrated service** and **standalone scripts** that demonstrate how an LLM can be used to interpret a **sample text CAPTCHA image** in a controlled, research-only setting.

## Authorship & Acknowledgement
- **Harpreet Kaur** (M.Sc. graduate) — primary author of the Master’s thesis project and full owner of RQ1/RQ2.
- **Argianto Rahartomo** — contributor to **RQ3** (this repository), focusing on the VueJS service integration and LLM-based pipeline.

> Note: **RQ1 and RQ2 are intentionally not published** because they are fully owned by Harpreet Kaur.

## Repository contents
- `integrated/` — VueJS integration (service + view component)
- `standalone/` — minimal standalone scripts (OpenAI/Gemini adapters)
- `image_result/` — example output for documentation

## Ethical & security note
This code is provided **for research and educational inspection only**. Do not use it to bypass protections on third-party services or to violate terms of service.

## Quick start (local)
### 1) Configure environment
Copy `.env.example` to `.env` and add your own API key(s).

### 2) Standalone run
Example (Node.js):
- `standalone/gpt4llm.js`
- `standalone/geminillm.js`

(Adjust the command below to match your script implementation)
- `node standalone/gpt4llm.js`

### 3) Vue integration
If this code is part of a larger Vue project, copy:
- `integrated/service/service.js` into your app service layer
- `integrated/views/TextCaptcha/TextCaptcha1_modif.vue` into your views/components

Then run your Vue dev server as usual.

## Limitations
- Prototype/demo only; not a production system
- Requires user-provided API keys (not included)
- Only demonstrates a **sample text CAPTCHA image** and a minimal pipeline

## Associated Publication
Parts of this repository (RQ3 prototype and service component) relate to the following publication:

Rahartomo, Argianto; Kaur, Harpreet; Ghafari, Mohammad.
Gameful Introduction to Cryptography for Dyslexic Students.
Proceedings of the 36th International Conference on Software Engineering Education and Training (CSEE and T), 2024, pages 1–5.
DOI: https://doi.org/10.1109/CSEET62301.2024.10663005

`BibTeX`
@INPROCEEDINGS{10663005,
author={Rahartomo, Argianto and Kaur, Harpreet and Ghafari, Mohammad},
booktitle={2024 36th International Conference on Software Engineering Education and Training (CSEE and T)},
title={Gameful Introduction to Cryptography for Dyslexic Students},
year={2024},
pages={1-5},
keywords={Training;Conferences;Writing;Dyslexia;Encryption;Inclusive education;dyslexia;cryptography;gameful experience},
doi={10.1109/CSEET62301.2024.10663005}
}

## License
MIT (see LICENSE)

## Citation
See `CITATION.cff`.
