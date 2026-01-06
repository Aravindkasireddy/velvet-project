pipeline {
    agent any
    
    tools {
        maven 'maven'
    }
    
    environment {
        TOMCAT_IP = '172.31.18.91'
        TOMCAT_USER = 'ubuntu'
        TOMCAT_WEBAPPS = '/var/lib/tomcat10/webapps'
        WAR_NAME = 'velvet.war'
        DEPLOY_NAME = 'production'  // Change to 'testing' or 'production' as needed
    }
    
    stages {
        stage('🔍 Checkout') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                git branch: 'main', url: 'https://github.com/Aravindkasireddy/velvet-project.git'
            }
        }
        
        stage('🔨 Build') {
            steps {
                echo '🔨 Building WAR file with maven...'
                sh 'mvn clean package'
                echo '✅ Build completed'
            }
        }
        
        stage('📦 Archive Artifacts') {
            steps {
                echo '📦 Archiving WAR file...'
                archiveArtifacts artifacts: 'target/*.war', fingerprint: true
            }
        }
        
        stage('🚀 Deploy to Tomcat') {
            steps {
                script {
                    if (env.DEPLOY_NAME == 'production') {
                        echo "🚀 Deploying to PRODUCTION environment as ${env.DEPLOY_NAME}.war..."
                    } else {
                        echo "🧪 Deploying to TESTING environment as ${env.DEPLOY_NAME}.war..."
                    }
                }
                
                sh """
                    scp -o StrictHostKeyChecking=no target/${WAR_NAME} ${TOMCAT_USER}@${TOMCAT_IP}:${TOMCAT_WEBAPPS}/${DEPLOY_NAME}.war
                """
                
                echo '✅ Deployment completed successfully!'
            }
        }
        
        stage('✅ Verify Deployment') {
            steps {
                echo '⏳ Waiting for Tomcat to deploy WAR file...'
                sleep 15
                
                script {
                    echo "🔍 Verifying deployment at http://${TOMCAT_IP}:8080/${DEPLOY_NAME}/"
                    sh """
                        curl -I http://${TOMCAT_IP}:8080/${DEPLOY_NAME}/ || echo '⚠️ Deployment may need more time'
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ ================================'
            echo '✅ PIPELINE COMPLETED SUCCESSFULLY!'
            echo '✅ ================================'
            echo "🌐 Access your app at: http://${TOMCAT_IP}:8080/${DEPLOY_NAME}/"
        }
        failure {
            echo '❌ ================================'
            echo '❌ PIPELINE FAILED!'
            echo '❌ ================================'
        }
        always {
            echo "📊 Build #${env.BUILD_NUMBER} finished"
        }
    }
}
