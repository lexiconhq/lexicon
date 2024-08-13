In order to run iOS simulator for e2e testing, a macOS environment is required. Therefore, we need to use a macOS runner in our CI pipeline. However, it's important to note that using a macOS runner in GitHub Actions consumes approximately 10 times more resources compared to an Ubuntu runner. Due to this increased resource usage, we have made the decision to disable running iOS tests in the CI pipeline to optimize resource allocation.

```yml
name: E2E test ios

on: workflow_call

jobs:
  e2e-test-ios:
    runs-on: macos-13

    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '16.x'

      - name: Configure JDK
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'

      - uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: 'latest-stable'

      - name: Get yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"

      - uses: actions/cache@v3
        id: yarn-cache
        with:
          path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
          key: ${{ runner.os }}-yarn-frontend-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-frontend-

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install Dependencies
        run: yarn install --frozen-lockfile

      - name: EAS build test
        if: ${{ env.BUILD_APP == 'TRUE' }}
        run: eas build -p ios --profile=test --non-interactive

      - name: Get current build url
        run: |
          JSON=$(eas build:list --distribution=simulator --status=finished --platform=ios --limit=1 --json --non-interactive)
          URL=$(echo $JSON | jq -r '.[0].artifacts.buildUrl')
          echo "::set-output name=BUILD_URL::$URL"
        id: url

      - name: Create target directory
        run: mkdir -p bin/IOS/

      - name: Download build
        id: downloadedApp
        run: curl -o bin/IOS/build.tar.gz -L "${{ steps.url.outputs.BUILD_URL }}"

      - name: Unzip app build
        run: |
          cd bin/IOS/
          ls -a
          for f in *.tar.gz; do tar -xvf "$f"; done
          ls
          cd ../..

      - name: Setup Detox
        run: |
          brew tap wix/brew
          brew install applesimutils
          npm install -g detox-cli

      - name: Run Detox tests
        run: yarn tests:ios:test
```
