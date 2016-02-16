
# By Jeff Russ https://github.com/Jeff-Russ
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._

require 'open-uri'
require 'uri'

require 'uri'

module Utils

   @@debug_on = false
    
   def global_debug bool; unless bool.nil? then @@debug_on = bool end
   end; module_function :global_debug

   def log string; if @@debug_on then print "\n# #{string}" end
   end; module_function :log
   
   def warn string; if @@debug_on then print "\n### warn: #{string}\n" end
   end; module_function :warn
   
   def err string; if @@debug_on then print "\n#### err: #{string}\n" end
   end; module_function :err

   def update string; if @@debug_on then print " #{string}" end
   end; module_function :update
   
   def hr;  puts; 40.times do print "_" end; puts; end; module_function :hr
   def bar; puts; puts;  40.times do print "#" end; puts; end; module_function :bar
   def br;  puts       end; module_function :br
   def br2; puts; puts end; module_function :br2

################################################################################

   def rm_last_exten string 
      return string.match(/(.*)\.[^.]+$/)[1] 
   end; module_function :rm_last_exten
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def str_to_bool string; 
      string.downcase!
      return string =~ (/(true|t|yes|y|1|on|show)$/i)
   end; module_function :str_to_bool
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def ins_parent_dir path, ins
      return path.rpartition('/').first<< ins<< path.rpartition('/').last
   end; module_function :ins_parent_dir
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
	def ins_after_domain_ext path, ins, domain_ext
		return path.rpartition(domain_ext).first<< domain_ext<< ins<< path.rpartition(domain_ext).last
	end; module_function :ins_after_domain_ext
#~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
   def str_to_hash_between (begin_flag, end_flag, string)
      output_hash = {} # the hash that will store everything 
      string = string.string_between_markers("begin_p_ext", "end_p_ext")
      unless string.blank?
         arr = string.gsub(/\s+/, '').split(/[=,:]/)  # strip whitespace; -> array
         hash = Hash[*arr.flatten]                    # convert to hash
         # now we'll convert keys to symbols and values to booleans
         hash.each do |k, v|    # convert strings to boolean
            if     v == "true"  then v = true
             elsif v == "false" then v = false
            end
            output_hash[k.to_sym] = v # convert keys to symbols
         end
         return output_hash
      else 
         return nil
      end
   end; module_function :str_to_hash_between
   
end