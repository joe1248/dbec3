/* Requires the Docker Pipeline plugin
        docker.image('node:6.3').inside {
            sh 'npm --version'
        }


*/
node('docker') {
    checkout scm
    stage('Build') {
        docker.image('php').inside {
            sh 'php --version'
        }
    }
}