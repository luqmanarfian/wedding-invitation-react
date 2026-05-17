pipeline {
    agent any

    environment {
        APP_NAME = "portfolio-website-react"
        IMAGE_NAME = "luqmanarfian/portfolio-website-react"
        IMAGE_TAG = "${env.GIT_COMMIT}"
        BRANCH = "main"
        SONARQUBE_SERVER = "sonarqube-server"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=${APP_NAME} \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.token=$SONAR_AUTH_TOKEN
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', 'docker-cred') {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy with Helm') {
            steps {
                sh """
                helm upgrade --install ${APP_NAME} ./helm/charts \
                --set image.name=${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh "kubectl rollout status deployment/${APP_NAME}"
            }
        }
    }

    post {
        failure {
            sh "helm rollback ${APP_NAME} || true"
        }
    }
}
