pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
    }
  }
  stages {
    stage('Build') {
      parallel {
        stage('Composer') {
          steps {
            sh 'composer install'
          }
        }
        stage('NPM') {
          steps {
            sh 'npm install'
            sh 'npm run dev'
          }
        }
      }
    }
    stage('Unit-Test') {
      parallel {
        stage('Front-End') {
          steps {
            sh 'npm run fe-testx'
          }
        }
        stage('Back-End') {
          steps {
            sh 'npm run be-testx'
          }
        }
      }
    }
  }
  options {
    buildDiscarder(logRotator(numToKeepStr: '2'))
  }
}