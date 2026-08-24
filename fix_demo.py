import re

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Fix the demo panel title
content = content.replace('dYZ" Solo Demo Mode', 'Solo Demo Mode')

# Make sure demo panel shows for teachers
# Find the joinApp function and ensure it shows the demo panel
old_pattern = r"(if \(myRole === 'teacher'\) \{[\s\S]*?create-room-panel'\)\.style\.display = 'block';)"
new_code = r"""\1
        const demoPanel = document.getElementById('demo-panel');
        if (demoPanel) demoPanel.style.display = 'block';"""

content = re.sub(old_pattern, new_code, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed demo panel")
