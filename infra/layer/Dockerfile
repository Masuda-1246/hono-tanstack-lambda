FROM amazonlinux:2023

# 必要なツールをインストール（curl ではなく curl-minimal を使う）
RUN dnf install -y gcc gcc-c++ make python3 zip tar gzip

# Node.js 22 をインストール（公式バイナリ）
ENV NODE_VERSION=22.4.0
RUN curl -fsSL https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz | \
    tar -xz -C /usr/local --strip-components=1

# 確認（任意）
RUN node -v && npm -v

# Layerビルド
WORKDIR /layer
RUN npm init -y && npm install @duckdb/node-api

# Layer構造に変換
RUN mkdir -p /layer/nodejs && mv node_modules /layer/nodejs/

# zip作成
RUN cd /layer && zip -r duckdb-layer.zip nodejs
