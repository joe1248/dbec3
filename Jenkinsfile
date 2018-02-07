pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
    }
    
  }
  stages {
    stage('Install') {
      parallel {
        stage('Composer Install') {
          steps {
            sh 'composer install'
          }
        }
        stage('') {
          steps {
            sh 'npm install'
            sh 'npm run dev'
          }
        }
      }
    }
    stage('Unit-Test') {
      parallel {
        stage('Front-End Unit-Test') {
          steps {
            sh 'npm run fe-testx'
          }
        }
        stage('') {
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