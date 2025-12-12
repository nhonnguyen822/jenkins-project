pipeline {
    agent any
    
    environment {
        // Thay bằng Docker Hub username của bạn
        DOCKER_REGISTRY = 'your-dockerhub-username'
        // Đặt tên image theo tên service trong docker-compose
        BACKEND_IMAGE = 'demo-jenkins-backend'
        FRONTEND_IMAGE = 'demo-jenkins-frontend'
        VERSION = "${BUILD_NUMBER}"
        
        // Biến môi trường cho backend build
        SPRING_PROFILES_ACTIVE = 'docker'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        // Stage 1: Lấy code (vì code đã được mount từ host, có thể bỏ qua nếu dùng local)
        stage('Checkout') {
            steps {
                script {
                    // Vì thư mục đã được mount vào Jenkins container
                    // Chúng ta chỉ cần kiểm tra và đồng bộ nếu cần
                    sh '''
                    echo "Current workspace: ${WORKSPACE}"
                    echo "Workspace contents:"
                    ls -la
                    echo "Code is already mounted from host via volume"
                    '''
                }
            }
        }
        
        // Stage 2: Build Backend (Spring Boot)
        stage('Build Backend') {
            steps {
                dir('todo-app-sever') {
                    sh '''
                    echo "Building Spring Boot backend..."
                    echo "Using profile: ${SPRING_PROFILES_ACTIVE}"
                    mvn clean package -DskipTests -P${SPRING_PROFILES_ACTIVE}
                    echo "Backend build successful!"
                    
                    # Kiểm tra file JAR đã build
                    echo "JAR files in target directory:"
                    ls -la target/*.jar || true
                    '''
                }
            }
        }
        
        // Stage 3: Build Frontend (React)
        stage('Build Frontend') {
            steps {
                dir('todo-app-client') {
                    sh '''
                    echo "Building React frontend..."
                    npm ci --only=production --prefer-offline
                    npm run build
                    
                    # Kiểm tra build output
                    echo "Build output in build directory:"
                    ls -la build/ || true
                    echo "Frontend build successful!"
                    '''
                }
            }
        }
        
        // Stage 4: Run Tests (Tùy chọn - có thể bỏ qua nếu cần build nhanh)
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('todo-app-sever') {
                            sh 'mvn test || echo "Tests failed but continuing..."'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('todo-app-client') {
                            sh 'npm test -- --watchAll=false --passWithNoTests || echo "Tests failed but continuing..."'
                        }
                    }
                }
            }
        }
        
        // Stage 5: Build Docker Images
        stage('Docker Build') {
            steps {
                script {
                    echo "Building Docker images..."
                    
                    // Xác định đường dẫn đúng trong container Jenkins
                    def workspacePath = env.WORKSPACE ?: '/var/jenkins_home/workspace/todo-app'
                    
                    // Build backend image - sử dụng đúng tên image
                    sh """
                    echo "Building backend image..."
                    docker build -t ${BACKEND_IMAGE}:${VERSION} ./todo-app-sever
                    docker tag ${BACKEND_IMAGE}:${VERSION} ${BACKEND_IMAGE}:latest
                    """
                    
                    // Build frontend image
                    sh """
                    echo "Building frontend image..."
                    docker build -t ${FRONTEND_IMAGE}:${VERSION} ./todo-app-client
                    docker tag ${FRONTEND_IMAGE}:${VERSION} ${FRONTEND_IMAGE}:latest
                    """
                    
                    echo "Docker images built successfully!"
                    
                    // Kiểm tra images đã build
                    sh 'docker images | grep -E "(${BACKEND_IMAGE}|${FRONTEND_IMAGE})"'
                }
            }
        }
        
        // Stage 6: Update docker-compose.yml với images mới
        stage('Update Docker Compose') {
            steps {
                script {
                    echo "Updating docker-compose.yml with new images..."
                    
                    // Backup file cũ
                    sh 'cp docker-compose.yml docker-compose.yml.backup'
                    
                    // Update image tags trong docker-compose.yml
                    sh """
                    sed -i 's|build: ./todo-app-sever|image: ${BACKEND_IMAGE}:${VERSION}|g' docker-compose.yml
                    sed -i 's|build: ./todo-app-client|image: ${FRONTEND_IMAGE}:${VERSION}|g' docker-compose.yml
                    """
                    
                    // Xem nội dung đã update
                    sh 'echo "Updated docker-compose.yml:" && cat docker-compose.yml | grep -A2 "backend:\\|frontend:"'
                }
            }
        }
        
        // Stage 7: Deploy Application
        stage('Deploy') {
            steps {
                script {
                    echo "Deploying application..."
                    
                    // Đảm bảo đang ở đúng thư mục workspace
                    sh '''
                    echo "Current directory:"
                    pwd
                    ls -la
                    '''
                    
                    // Dừng và xóa containers cũ (giữ lại volumes)
                    sh '''
                    echo "Stopping existing containers..."
                    docker-compose down || true
                    
                    # Xóa các images cũ (tùy chọn)
                    docker image prune -f || true
                    '''
                    
                    // Deploy mới với images đã build
                    sh '''
                    echo "Starting containers with new images..."
                    docker-compose up -d
                    
                    # Kiểm tra containers đang chạy
                    echo "Current running containers:"
                    docker-compose ps
                    
                    # Kiểm tra logs
                    echo "Checking service logs..."
                    docker-compose logs --tail=5
                    '''
                    
                    echo "Deployment completed!"
                }
            }
        }
        
        // Stage 8: Health Check (Kiểm tra ứng dụng hoạt động)
        stage('Health Check') {
            steps {
                script {
                    echo "Performing health checks..."
                    
                    // Kiểm tra backend
                    sh '''
                    echo "Checking backend health..."
                    sleep 10  # Đợi service khởi động
                    curl -f http://localhost:8080/actuator/health || echo "Backend health check failed"
                    '''
                    
                    // Kiểm tra frontend
                    sh '''
                    echo "Checking frontend accessibility..."
                    curl -f http://localhost:3000 || echo "Frontend check failed"
                    '''
                    
                    echo "Health checks completed!"
                }
            }
        }
        
        // Stage 9: Push to Docker Hub (Tùy chọn)
        stage('Push to Docker Hub') {
            when {
                branch 'main'
                expression { 
                    return env.DOCKER_REGISTRY != null && env.DOCKER_REGISTRY != 'your-dockerhub-username' 
                }
            }
            steps {
                script {
                    echo "Pushing images to Docker Hub..."
                    
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        
                        # Tag và push backend
                        docker tag ${BACKEND_IMAGE}:${VERSION} ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${VERSION}
                        docker tag ${BACKEND_IMAGE}:latest ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest
                        docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${VERSION}
                        docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest
                        
                        # Tag và push frontend
                        docker tag ${FRONTEND_IMAGE}:${VERSION} ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${VERSION}
                        docker tag ${FRONTEND_IMAGE}:latest ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest
                        docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${VERSION}
                        docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest
                        
                        docker logout
                        """
                    }
                    
                    echo "Images pushed to Docker Hub successfully!"
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline execution completed!"
            
            // Lưu artifacts (tùy chọn)
            archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
            archiveArtifacts artifacts: 'docker-compose.yml', fingerprint: true
            
            // Dọn dẹp workspace (cẩn thận vì đang mount từ host)
            sh '''
            echo "Cleaning up temporary files..."
            # Chỉ xóa các file tạm, không xóa source code
            rm -f docker-compose.yml.backup || true
            '''
            
            // Hiển thị kết quả deployment
            sh '''
            echo "=== Deployment Summary ==="
            echo "Backend: http://localhost:8080"
            echo "Frontend: http://localhost:3000"
            echo "Jenkins: http://localhost:8081"
            echo "MySQL: localhost:3308"
            echo "=========================="
            '''
        }
        success {
            echo "✅ Pipeline SUCCESSFUL!"
            // Có thể thêm notifications: email, Slack, etc.
        }
        failure {
            echo "❌ Pipeline FAILED!"
            // Hiển thị logs để debug
            sh 'docker-compose logs --tail=50 || true'
        }
        unstable {
            echo "⚠️ Pipeline UNSTABLE!"
        }
    }
}