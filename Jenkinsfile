pipeline {
    agent any

    environment {
        // Define environment variables based on the branch name
        COMPOSE_PROJECT_NAME = "${env.BRANCH_NAME == 'main' ? 'prod' : env.BRANCH_NAME == 'dev' ? 'staging' : 'test'}"
        APP_PORT = "${env.BRANCH_NAME == 'main' ? '80' : env.BRANCH_NAME == 'dev' ? '8080' : '8081'}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out branch: ${env.BRANCH_NAME}"
                checkout scm
            }
        }

        stage('Install Dependencies & Test') {
            steps {
                echo "Running tests for branch: ${env.BRANCH_NAME}"
                // Since this is a simple example, we just simulate tests
                // In a real scenario, you would run npm install && npm test in client/server
                bat '''
                    echo "Simulating tests..."
                    echo "Tests passed!"
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker images for ${COMPOSE_PROJECT_NAME} environment"
                bat '''
                    docker compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to ${COMPOSE_PROJECT_NAME} environment on port ${APP_PORT}"
                // We bring down previous containers of this project name and bring up new ones
                bat """
                    docker-compose -p ${COMPOSE_PROJECT_NAME} down
                    docker-compose -p ${COMPOSE_PROJECT_NAME} up -d
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
            bat 'docker ps'
        }
        success {
            echo 'Deployment successful.'
        }
        failure {
            echo 'Deployment failed. Check the logs.'
        }
    }
}
