pipeline {
    options {
      timeout(time: 1, activity: false, unit: 'HOURS') 
    }
    agent any
     tools {
        nodejs "node"
    }
    stages {
        stage('Build') {
            steps {
               sh 'npm install  --no-cache'
               sh 'export PATH=$PATH:$PWD/node_modules/@angular/cli/bin/ng'
               sh 'npm run build'
               sh 'ls -al'
            }
        }
        stage('Clean') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'javascript development server',
                            transfers: [sshTransfer(cleanRemote: false,
                                excludes: '',
                                execCommand: 'cd /var/www/html/chefk-cms/ && pwd && ls -l && rm -rf *',
                                execTimeout: 300000000,
                                flatten: false,
                                makeEmptyDirs:
                                false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: '',
                                remoteDirectorySDF: false,
                                removePrefix: '', sourceFiles: '')],
                            usePromotionTimestamp: false,
                            useWorkspaceInPromotion: false,
                            verbose: false)
                    ])
            }
        }
        stage('Deploy') {
                steps {
                    sshPublisher(
                        publishers: [sshPublisherDesc(configName: 'javascript development server',
                            transfers: [
                                sshTransfer(cleanRemote: false, 
                                excludes: '', execCommand: '', 
                                execTimeout: 120000, 
                                flatten: false, 
                                makeEmptyDirs: false, 
                                noDefaultExcludes: false, 
                                patternSeparator: '[, ]+', 
                                remoteDirectory: '/var/www/html/chefk-cms/', 
                                remoteDirectorySDF: false, 
                                removePrefix: 'dist/',
                                sourceFiles: 'dist/**/*')
                            ], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])

            }
            
        }
    }
}
