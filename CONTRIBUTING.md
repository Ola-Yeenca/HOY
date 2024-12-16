Contributing to HOY

Thank you for your interest in contributing to House of Young (HOY)! We’re excited to have you on board to help shape the future of nightlife experiences. Whether you’re fixing bugs, building new features, or improving documentation, your contributions make a difference.

🛠 How to Contribute

1. Getting Started

To start contributing, please:
	•	Read this guide thoroughly.
	•	Familiarize yourself with the project by reviewing the README.md.

2. Code of Conduct

We follow a Code of Conduct to ensure a welcoming and respectful environment for everyone.

3. Contribution Workflow

Step 1: Fork the Repository
	1.	Navigate to HOY GitHub Repository.
	2.	Click the Fork button (top-right corner).
	3.	Clone your fork:

git clone https://github.com/<your-username>/HOY.git  
cd HOY  



Step 2: Create a Branch
	1.	Create a feature or bugfix branch:

git checkout -b feature/<your-feature-name>  


	2.	Use meaningful names for your branches. Examples:
	•	feature/add-ai-music-recommendation
	•	bugfix/auth-token-error

Step 3: Install Dependencies
	1.	Follow the setup instructions from the README.md to get the development environment running.
	2.	Use Docker Compose:

docker-compose up --build  



Step 4: Make Your Changes
	1.	Write clean, modular, and well-documented code.
	2.	Follow our coding standards:
	•	Frontend: Use ESLint and adhere to React/Next.js best practices.
	•	Backend: Follow Django coding guidelines and keep apps modular.
	•	Styling: Use TailwindCSS conventions and responsive designs.

Step 5: Test Your Changes
	1.	Write or update unit and integration tests where applicable.
	2.	Run the tests to verify your changes:
	•	Frontend:

npm run test  


	•	Backend:

python manage.py test  



Step 6: Commit Your Changes
	1.	Follow our commit message format for consistency:

[Type] <Brief Description>  

	•	Examples:
	•	[Feature] Add AI music recommendations using TensorFlow
	•	[Fix] Resolve JWT authentication issues in frontend

	2.	Stage and commit your changes:

git add .  
git commit -m "[Type] <Brief Description>"  



Step 7: Push and Open a Pull Request (PR)
	1.	Push your branch to your fork:

git push origin feature/<your-feature-name>  


	2.	Open a PR to the main branch on the original repo.
	3.	Provide a clear and descriptive title and body for your PR.

Example PR Description:

### Description  
This PR adds AI-powered music recommendations using TensorFlow.  

### Changes  
1. Implemented recommendation models.  
2. Integrated backend endpoints with frontend UI.  
3. Added unit tests for AI models.  

### Related Issues  
Fixes #12  

	4.	Be ready to discuss and revise your changes based on feedback.

🛠 Development Environment

Prerequisites
	•	Frontend:
	•	Node.js 18+
	•	Recommended: Install nvm to manage Node versions.
	•	Backend:
	•	Python 3.11+
	•	Docker & Docker Compose

Environment Variables

Ensure you configure your .env files in both frontend/ and backend/ directories. Refer to the example:

# Frontend  
NEXT_PUBLIC_API_URL=http://localhost:8000  
NEXT_PUBLIC_MAPBOX_TOKEN=your_token  
NEXT_PUBLIC_OPENAI_KEY=your_key  

# Backend  
DJANGO_SECRET_KEY=your_secret_key  
DATABASE_URL=postgresql://user:pass@localhost:5432/hoy  
REDIS_URL=redis://localhost:6379/0  

🚀 Areas You Can Contribute To

1. AI-Powered Features
	•	Build TensorFlow models for music recommendations.
	•	Integrate GPT-4 for virtual concierge services.

2. Real-Time Features
	•	Develop APIs and frontend for real-time DJ performance schedules.
	•	Implement WebSocket support for live updates.

3. 3D Venue Mapping
	•	Leverage Three.js and React Three Fiber to create interactive venue models.
	•	Add support for dynamic animations using GSAP.

4. Authentication
	•	Debug frontend/backend JWT issues.
	•	Ensure proper session handling and user flows.

5. Documentation
	•	Improve the README.md or other guides.
	•	Add comments and code explanations for clarity.

🧪 Testing Guidelines
	•	Write tests for all features you implement or fix.
	•	Frontend:
	•	Use Jest and React Testing Library.
	•	Test components, pages, and user flows.
	•	Backend:
	•	Use Django’s built-in TestCase module.
	•	Test models, views, and serializers.

🤝 Code of Conduct

We are committed to fostering an open and welcoming environment. Please read and adhere to our Code of Conduct.

❓ Questions?

If you have any questions, feel free to:
	•	Open a GitHub Discussion in the HOY repo.
	•	Email the maintainers at fromthehouseofyoung@gmail.com.

Thank you for contributing to House of Young (HOY)! Together, we’re redefining the nightlife experience.
