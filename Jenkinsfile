#!groovy

pipeline {
	options {
		// Only keep the 2 most recent builds
		buildDiscarder(logRotator(numToKeepStr:'2'))
	}
    agent {
        dockerfile true
    }
    stages {
        stage('Composer Install') {
            steps {
                sh 'composer install'
            }
        }
        stage('Back-End Unit-Test') {
            steps {
                sh './bin/phpunit --stop-on-failure'
            }
        }
        stage('NPM Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Front-End Unit-Test') {
            steps {
                sh 'npm run fe-testx'
            }
        }
    }
}