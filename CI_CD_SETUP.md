# CI/CD Deployment Setup Guide (Direct VM Build)

This guide walks you through the step-by-step process of configuring your target Virtual Machine (VM) and GitHub repository to enable automated CI/CD deployments by building the application directly on your VM.

---

## Architecture Overview

The CI/CD pipeline operates in two main stages:
1. **Continuous Integration (CI)**: GitHub Actions lints (`oxlint`) and compiles (`tsc && vite build`) the React/Vite/TypeScript codebase to verify correctness on every PR and push.
2. **Continuous Deployment (CD)**: On a successful merge to `main`, GitHub Actions connects to your VM via SSH, checks out/updates the source code via Git, and builds/restarts the containers directly using `docker compose up --build -d`.

---

## Step 1: Target VM Configuration

Ensure your VM satisfies the following prerequisites.

### A. Install Git, Docker, and Docker Compose
If they are not already installed on your VM, install them by running the following commands (example for Ubuntu/Debian):

```bash
# Update package list and install git and prerequisites
sudo apt-get update
sudo apt-get install -y git ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine & Compose
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### B. Grant Docker Permissions to the Deploy User
To avoid running docker commands with `sudo` (which would fail in the automated SSH action), add your SSH deployment user (e.g., `ubuntu`) to the `docker` group:

```bash
# Add the user to the docker group
sudo usermod -aG docker $USER

# Apply the new group membership (or restart the VM/SSH session)
newgrp docker
```
*Verify that you can run `docker ps` without `sudo` before proceeding.*

### C. Open Firewall Ports
Ensure your VM permits incoming traffic on the port mapped to the application. In the default configuration:
* The application runs internally on port `80` inside the container.
* It is exposed on host port **`8080`** (`docker-compose.yml`).
* Run the appropriate firewall configuration commands (e.g., UFW or cloud provider security rules):
  ```bash
  sudo ufw allow 8080/tcp
  ```

---

## Step 2: Configure Repository Authentication on the VM (For Private Repos)

If your repository is **private**, the VM needs permission to pull changes from GitHub.

### Option A: Using SSH Deploy Keys (Recommended)
1. On the VM, generate a deployment key:
   ```bash
   ssh-keygen -t ed25519 -C "vm-deploy-key" -f ~/.ssh/id_ed25519
   ```
2. Display the public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
3. Copy the public key text, go to your GitHub repository -> **Settings** -> **Deploy keys** -> **Add deploy key**. Paste the key and name it (e.g., "VM Deploy Key").
4. On your VM, verify you can connect:
   ```bash
   ssh -T git@github.com
   ```

   > [!TIP]
   > **Troubleshooting SSH Connection Timeouts (Port 22 Blocked)**
   >
   > If you get `ssh: connect to host github.com port 22: Connection timed out`, it means outbound traffic on port 22 is blocked (common in many cloud VPS environments). You can bypass this by routing SSH traffic over port 443 (HTTPS):
   >
   > 1. Test connection to GitHub over port 443 using the deploy key:
   >    ```bash
   >    ssh -i ~/.ssh/id_ed25519 -T -p 443 git@ssh.github.com
   >    ```
   > 2. If it succeeds, configure your SSH client to always use port 443 and the deploy key for GitHub. Edit (or create) the `~/.ssh/config` file on your VM:
   >    ```bash
   >    nano ~/.ssh/config
   >    ```
   >    And add the following block:
   >    ```text
   >    Host github.com
   >      Hostname ssh.github.com
   >      Port 443
   >      User git
   >      IdentityFile ~/.ssh/id_ed25519
   >    ```
   > 3. Verify the configuration connects successfully:
   >    ```bash
   >    ssh -T git@github.com
   >    ```

5. Ensure the repository URL cloned on the VM uses SSH. If cloning for the first time manually, run one of the following:
   * **Option A: If you configured `~/.ssh/config` (Recommended)**
     SSH automatically applies the port and key settings:
     ```bash
     git clone git@github.com:eleluong/agentic_ai_practices.git ~/ai_governance_practices
     ```
   * **Option B: Specify the key manually (Without config file)**
     * *Over standard port 22:*
       ```bash
       GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519" git clone git@github.com:eleluong/agentic_ai_practices.git ~/ai_governance_practices
       ```
     * *Over port 443 (If port 22 is blocked):*
       ```bash
       GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519 -p 443" git clone git@ssh.github.com:eleluong/agentic_ai_practices.git ~/ai_governance_practices
       ```

---

## Step 3: Configure SSH Authentication for GitHub Actions

We need to generate a secure SSH key pair for GitHub Actions to authenticate with your VM.

### A. Generate SSH Key Pair
On your local machine or the VM itself, generate a new SSH key pair:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions
```
*When prompted for a passphrase, press **Enter** (leave it empty) so that GitHub Actions can use the key autonomously.*

### B. Register the Public Key on the VM
Copy the content of the generated public key (`~/.ssh/github_actions.pub`) and append it to the VM's `authorized_keys` file for the deploy user:

```bash
# Run this on the VM (replace SSH_PUBLIC_KEY with the text from github_actions.pub)
echo "your-ssh-public-key-content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

---

## Step 4: Configure GitHub Repository Secrets

GitHub Actions accesses sensitive connection parameters securely using secrets.

1. Navigate to your repository on GitHub.
2. Go to **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.
3. Create the following three secrets:

| Secret Name | Value Description | Example |
| :--- | :--- | :--- |
| **`SSH_PRIVATE_KEY`** | The complete content of the private key (`~/.ssh/github_actions`) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| **`VM_HOST`** | The public IP address or Domain Name of the VM | `203.0.113.10` or `app.domain.com` |
| **`VM_USER`** | The SSH user on the VM | `ubuntu` or `root` |

---

## Step 5: Verify Deployment and Troubleshooting

Once the setup is done, any push or merge to the `main` branch will initiate the pipeline.

### A. Monitor the Run
1. Go to the **Actions** tab of your GitHub repository.
2. Click on the active workflow run to check steps, build logs, and deployment output.

### B. Verify Container Status on the VM
Log in to your VM and check if the container is running and healthy:

```bash
# Navigate to the deploy directory
cd ~/ai_governance_practices

# List running containers
docker compose ps

# View real-time container logs
docker compose logs -f
```
