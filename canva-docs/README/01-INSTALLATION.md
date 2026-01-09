# 01-INSTALLATION.md

## Installation

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/OneWeekMVP/canva-clone.git
cd canva-clone
```

**See:** Fig.1, Fig.2, Fig.3
![Fig.1](../images/fig1.png)
*Fig.1: Create a project folder.*
![Fig.2](../images/fig2.png)
*Fig.2: Grab the HTTPS URL.*
![Fig.3](../images/fig3.png)
*Fig.3: Clone and change the directory.*

### Step 2: Copy Environment File

```bash
cp .env.example .env
```

**See:** Fig.4
![Fig.4](../images/fig4.png)
*Fig.4: Check for versions and copy .env.example*

### Step 3: Check Your Package Manager

If using Bun:
```bash
bun --version
# Should output: 1.3.5 or higher
```

If using npm:
```bash
node --version
# Should output: v18.0.0 or higher
```

### Step 4: Install Dependencies

Using Bun:
```bash
bun install
```

Using npm:
```bash
npm install
```

**What this does:** Downloads all project dependencies into `node_modules` folder.

### Step 5: Test Run (Will Fail - Expected!)

```bash
bun dev
# or
npm run dev
```

You'll see this error:
```
Error: No database connection string was provided to `neon()`. 
Perhaps an environment variable has not been set?
```

**This is normal!** We'll fix it in the next step by setting up the database.

**See:** Fig.
![Fig.5](../images/fig5.png)
*Fig.5: Database URL, missing it in .env file*

---

**Previous:** [00-PREREQUISITES.md](./00-PREREQUISITES.md)  
**Next:** [02-DATABASE-SETUP.md](./02-DATABASE-SETUP.md)

---
