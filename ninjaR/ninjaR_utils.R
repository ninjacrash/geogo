packagedownloader <- function(requirementsfile) {
  # Function to download packages in r-requirements.txt
  requirements <- read.table(requirementsfile, header = T, sep = ",")
  packagelist <- c(names(requirements))
  new.packages <- packagelist[!(packagelist %in% installed.packages()[, "Package"])]
  if (length(new.packages)) {
    install.packages(new.packages, dependencies = TRUE, repos = "http://cran.us.r-project.org")
  }
  sapply(packagelist, require, character.only = TRUE)
}

# Store all scripts here
scripts <- c("ninjaR_miner.R")

repo_sourcer <- function(){
  # Sources all R scripts in repo
  for(s in scripts){
    source(s)
    # print(paste("Sourced",s))
  }  
}

unpunctuate_and_upper <- function(text){
  toupper(gsub("[[:punct:]]", "", text))
}

sentence_splitter <- function(sentence){
  strsplit(unpunctuate_and_upper(sentence), split = ' ')[[1]]
}

stopwords_corpora <- as.character(read.csv("./data/large_stopwords_corpora.csv",header=F)$V1)

build_word_count <- function(sentences){
  collector <- data.frame('word' = character(), 'count' = numeric())
  for(i in 1:length(sentences)){
    words <- sentence_splitter(sentences[i])
    for (word in 1:length(words)){
      if(!words[word] %in% stopwords_corpora){
        if(words[word] %in% collector$word){
          log.vec <- collector$word == words[word]
          count <- collector[log.vec, 'count']
          count <- count + 1
          collector[log.vec, 'count'] <- count
          } else{
          collector <- rbind(collector, data.frame('word' = words[word], 'count' = 1))
        }
      }
    }
  }
  collector[with(collector, order(-count)), ]
}