import React from \"react\";\nimport { render } from \"react-dom\";\n\nconst App = () => (\n  <div>\n    <h1>Tutorial!</h1>\n  </div>\n);\n\nconst Home = () => (\n  <div>\n    <h2>Welcome</h2>\n  </div>\n);\n\nconst Dashboard = () => (\n  <div>\n    <h2>Dashboard</h2>\n  </div>\n);\n\nrender(<App />, document.getElementById(\"root\"));\n