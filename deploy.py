import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.10.184.76', username='USER', key_filename='C:\\Users\\USER\\.ssh\\id_ed25519')

commands = [
    'ansible-playbook /path/to/ansible_playbooks/playbook.yml'
]

for command in commands:
    stdin, stdout, stderr = ssh.exec_command(command)
    print(stdout.read().decode())
    print(stderr.read().decode())

ssh.close()
