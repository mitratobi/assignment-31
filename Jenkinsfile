pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mitratobi/assignment-31.git'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build mongodb backend frontend'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d mongodb backend frontend'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! App running at http://localhost:3000'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}
