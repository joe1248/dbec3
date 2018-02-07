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
        stage('NPM Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('NPM Package') {
            steps {
                sh 'npm run dev'
            }
        }
        stage('Front-End Unit-Test') {
            steps {
                sh 'npm run fe-testx'
            }
        }
        stage('Back-End Unit-Test + Functional') {
            steps {
                //sh './bin/phpunit --stop-on-failure'
				sh 'npm run be-testx'
            }
        }
    }
}