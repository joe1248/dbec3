pipeline {
    agent {
        docker { image 'joseph1248:dbec' }
    }
    stages {
        stage('Test') {
            steps {
                sh 'node --version'
            }
        }
    }
}